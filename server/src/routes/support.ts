import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { Ticket } from '../models/Ticket';
import { Notification } from '../models/Notification';
import { User } from '../models/User';
import { AIHelpdeskService } from '../services/aiHelpdeskService';
import { EmailService } from '../services/emailService';

const router = Router();
router.use(authenticateToken);

// Customer creates a ticket or sends a message
router.post('/tickets', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subject, message, ticketId } = req.body;
    const userId = req.user!._id;

    let ticket;
    if (ticketId) {
      ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        res.status(404).json({ error: 'Ticket not found' });
        return;
      }
      ticket.messages.push({ sender: userId, message, isAI: false });
      ticket.status = 'open'; // Reopen if they message again
    } else {
      ticket = new Ticket({
        customer: userId,
        subject,
        messages: [{ sender: userId, message, isAI: false }]
      });
    }
    await ticket.save();

    // AI Auto-Reply Logic
    const aiResponse = await AIHelpdeskService.autoReply(message);
    ticket.messages.push({
      sender: null as any, // Null sender implies System/AI
      message: aiResponse.reply,
      isAI: true
    });
    
    if (!aiResponse.needsHuman) {
      // AI solved it, theoretically. But we leave status open until user says satisfied.
    } else {
      // Needs human, we can notify admins
      const admins = await User.find({ role: { $in: ['admin', 'product_manager'] } });
      const notifications = admins.map(admin => ({
        user: admin._id,
        title: 'New Support Ticket',
        message: `Ticket requiring human attention from \${req.user!.name}`,
        link: `/admin/support`
      }));
      await Notification.insertMany(notifications);
    }
    
    await ticket.save();
    res.json({ ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process ticket' });
  }
});

// Fetch user's tickets
router.get('/tickets', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = ['admin', 'product_manager'].includes(req.user!.role) ? {} : { customer: req.user!._id };
    const tickets = await Ticket.find(query).populate('customer', 'name email').sort({ updatedAt: -1 });
    res.json({ tickets });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Admin/PM replies
router.post('/tickets/:id/reply', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!['admin', 'product_manager'].includes(req.user!.role)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const { message } = req.body;
    const ticket = await Ticket.findById(req.params.id).populate('customer');
    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    ticket.messages.push({
      sender: req.user!._id,
      message,
      isAI: false
    });
    ticket.status = 'open';
    ticket.assignedTo = req.user!._id;
    await ticket.save();

    // Notify user via DB
    await Notification.create({
      user: ticket.customer._id,
      title: 'Support Update',
      message: `An agent replied to your ticket: \${ticket.subject}`,
      link: '/support'
    });

    // Notify user via Email
    const customer = ticket.customer as any;
    await EmailService.sendTicketReplyEmail(customer.email, message);

    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reply' });
  }
});

// Resolve ticket
router.put('/tickets/:id/resolve', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    // Only customer or admin can resolve
    if (ticket.customer.toString() !== req.user!._id.toString() && !['admin', 'product_manager'].includes(req.user!.role)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    ticket.status = 'resolved';
    await ticket.save();
    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve ticket' });
  }
});

// Feedback
router.post('/tickets/:id/feedback', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { score, text } = req.body;
    const ticket = await Ticket.findOne({ _id: req.params.id, customer: req.user!._id });
    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }
    ticket.feedbackScore = score;
    ticket.feedbackText = text;
    ticket.status = 'closed';
    await ticket.save();
    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

export default router;
