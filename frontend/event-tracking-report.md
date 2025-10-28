# Event tracking report

This document lists all PostHog events that have been automatically added to your Next.js application.

## Events by File

### app/page.tsx

- **newsletter_subscribed**: Tracks when a user submits the newsletter signup form on the homepage.
- **product_details_viewed**: Tracks when a user clicks the 'View Details' button for a product in the featured collection.

### app/products/page.tsx

- **product_collection_filtered**: Fired when a user clicks on a collection button to filter the list of products.
- **product_fetch_retried**: Fired when a user clicks the 'Try Again' button after an error occurred while fetching products.

### app/products/[handle]/page.tsx

- **product-added-to-cart**: Fired when a user adds a product to their shopping cart from the product detail page.
- **product-favorite-toggled**: Fired when a user clicks the heart icon to add or remove a product from their favorites.

### app/cart/page.tsx

- **cart_item_quantity_changed**: Fired when a user changes the quantity of an item in their cart using the plus or minus buttons.
- **checkout_proceeded**: Fired when a user clicks the 'Proceed to Checkout' button to start the checkout process.

### app/checkout/success/page.tsx

- **continue_shopping_clicked**: Fired when the user clicks the 'Continue Shopping' button on the order confirmation page.
- **contact_support_clicked**: Fired when the user clicks the 'Contact Support' button on the order confirmation page.

### app/components/NavBar.tsx

- **navbar-cart-icon-clicked**: Fired when a user clicks the shopping cart icon in the navigation bar. Includes the number of items in the cart.
- **navbar-shop-now-clicked**: Fired when a user clicks a 'Shop Now' button in the navigation bar. The location property indicates if it was in the 'header' or 'mobile_menu'.
- **navbar-mobile-menu-toggled**: Fired when a user clicks the button to open or close the mobile navigation menu. The 'open' property indicates the new state of the menu.

### app/components/SearchBar.tsx

- **product-search-executed**: Fired when a user's product search is successfully executed via the search bar.
- **product-search-failed**: Fired when a product search fails due to an error.

### app/contact/page.tsx

- **contact-form-validation-failed**: Fired when a user tries to submit the contact form, but it fails client-side validation.
- **contact-form-submitted**: Fired when a user successfully submits the contact form after passing validation.

### app/custom-design/page.tsx

- **custom-design-image-uploaded**: Fired when a user successfully selects and uploads an image for their custom design.
- **custom-design-request-submitted**: Fired when a user successfully submits the custom design request form.

### app/blog/[slug]/page.tsx

- **blog_cta_clicked**: Fired when a user clicks the 'Shop Ocean Products' call-to-action button on a blog post page.
- **related_article_clicked**: Fired when a user clicks on a related article link at the bottom of a blog post.


## Events still awaiting implementation
- (human: you can fill these in)
---

## Next Steps

1. Review the changes made to your files
2. Test that events are being captured correctly
3. Create insights and dashboards in PostHog
4. Make a list of events we missed above. Knock them out yourself, or give this file to an agent.

Learn more about what to measure with PostHog and why: https://posthog.com/docs/new-to-posthog/getting-hogpilled
