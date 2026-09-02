# Creative Learning — 3+3+3+3 Catalogue Update

This build keeps the existing website design/content and seeds the live catalogue with:
- 3 products/components
- 3 starter kits
- 3 practical activities
- 3 projects

The admin panel is connected to the same browser data store as the website. Changes made in Admin are reflected on the website in the same browser.

## Admin additions
- Add/remove kits
- Add/remove practical activities
- Add/remove projects
- Edit existing kits/practicals/projects
- Upload multiple images and one PDF for each learning item
- Existing product/component editing remains available

## Seed catalogue
### Products
- Arduino UNO with Cable
- Arduino Nano with Cable
- Arduino Mega with Cable

### Kits
- Arduino Beginner Starter Kit V2
- Arduino Beginner Starter Kit V1
- Electronics Components Kit V1

### Practicals
- Ultrasonic Distance Lab
- Soil Moisture Test
- Temperature Monitoring

### Projects
- Obstacle Avoiding Robot
- Smart Plant Watering
- Wireless Appliance Controller

A catalogue version marker resets older v1/v4 browser catalogue data to this requested seed while preserving company settings where possible.

## Visual refinement
- Cleaned up catalogue/learning-card image frames with consistent padding, borders, radius and subtle shadows.
- Removed the heavy image-border treatment that made kit imagery look boxed-in.
- Improved thumbnail states for a more professional gallery appearance.

## V9 Professional Visual Refresh
- Updated background system with soft multi-tone gradients and ambient motion.
- Refined text hierarchy and contrast for a cleaner premium look.
- Upgraded navigation/tab styling with active-state gradients and lift interactions.
- Upgraded primary/secondary buttons with depth, hover lift, and animated shine.
- Added smoother card hover motion, reveal transitions, and subtle ambient animations.
- Added reduced-motion fallbacks for accessibility.


Media display rule update: Admin-uploaded images now replace the default catalogue/source-page images. When a PDF and an image are attached, the website shows the attached image and PDF only.


PDF display rule: product/component/kit/practical/project PDF buttons are conditional. If Admin has uploaded a PDF for that item, the PDF option appears in the card/gallery and product-detail modal. If no PDF is uploaded, no PDF option is displayed. Default bundled PDFs are not automatically shown.
