---
name: AYRIX Product Architecture Rule
description: Enforces the use of MongoDB as the single source of truth for the AYRIX product catalog and prohibits external e-commerce APIs.
---

# IMPORTANT PRODUCT DATA ARCHITECTURE:

Do not use FakeStore, DummyJSON, Myntra private APIs, scraped Myntra data, or any external e-commerce API as the core product source.

The application's product catalog must be owned by this application and stored in MongoDB Atlas.

Create a realistic seed dataset with products, categories, brands, sizes, garment measurements, fit types, fabric information, stretch levels, prices, images, tags and size charts.

The frontend must never contain hardcoded product arrays or hardcoded product-specific AYRIX results.

All product catalog data must flow through the backend REST API from MongoDB Atlas.

Create CRUD APIs for products where appropriate and an admin interface for managing the catalog.

AYRIX (formerly FitShield) recommendation calculations must use the actual product data retrieved from MongoDB. 

The application should be designed so that a future external e-commerce catalog API could be integrated through a separate service/adapter without changing the frontend or AYRIX business logic, but the current application must work completely using MongoDB as its source of truth.

The name of the site and the fit engine is **AYRIX**, not FitShield. Consider it as AYRIX going forward.

When returning a fit recommendation to the user, ensure it is generated dynamically based on structured backend responses (measurements, purchase history, etc.) rather than hardcoded heuristics on the frontend.
