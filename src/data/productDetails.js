// Hand-written descriptions and variants for every product currently in
// src/data/products.js, keyed by product name. seedProducts.mjs merges this
// in when uploading to Firestore, so the catalog arrives fully filled out.
//
// Each variant option is { label, priceDelta } — priceDelta is added to the
// product's base price when the shopper picks that option (0 = no change).
//
// You don't need to touch image paths here — keep uploading files to
// public/image/ and pointing the "image" field at them (or swap the image
// field for each product afterwards, either in the Firebase Console or the
// Admin Dashboard's product list).

export const productDetails = {
  'ASUS Prime GeForce RTX 5060 Ti': {
    description:
      'A next-gen graphics card built for smooth 1440p and entry-level 4K gaming. ' +
      'The 16GB of GDDR7 memory and PCIe 5.0 interface give you headroom for the latest ' +
      'AAA titles, while DLSS 4 and hardware ray tracing keep frame rates high without ' +
      "sacrificing visual detail. Runs cool and quiet thanks to ASUS's axial-tech fan design.",
    variants: [{ name: 'Memory', options: [{ label: '16GB GDDR7', priceDelta: 0 }] }],
  },
  'iBUYPOWER SlateMesh Gaming PC': {
    description:
      'A pre-built gaming desktop that pairs an Intel Core i7 with an RTX 5070 for ' +
      '1440p-to-4K gaming out of the box. 32GB of DDR5 and a 1TB NVMe SSD mean fast load ' +
      'times and plenty of room for your library, and built-in Wi-Fi 7 keeps online play ' +
      'lag-free. Comes with Windows 11 installed and ready to go.',
    variants: [
      {
        name: 'Storage',
        options: [
          { label: '1TB SSD', priceDelta: 0 },
          { label: '2TB SSD', priceDelta: 150 },
        ],
      },
      {
        name: 'RAM',
        options: [
          { label: '32GB', priceDelta: 0 },
          { label: '64GB', priceDelta: 200 },
        ],
      },
    ],
  },
  'IPHONE 17 Pro Max': {
    description:
      "Apple's flagship phone, powered by the A19 Pro chip for fast performance and " +
      'all-day battery life. The 48MP camera system captures detailed photos and 4K video ' +
      'in any light, and the USB-C port makes charging and transfers effortless. Ships with ' +
      'iOS 27 and years of software updates ahead.',
    variants: [
      {
        name: 'Storage',
        options: [
          { label: '256GB', priceDelta: 0 },
          { label: '512GB', priceDelta: 150 },
          { label: '1TB', priceDelta: 350 },
        ],
      },
      {
        name: 'Color',
        options: [
          { label: 'Titanium Black', priceDelta: 0 },
          { label: 'Titanium White', priceDelta: 0 },
          { label: 'Titanium Blue', priceDelta: 0 },
        ],
      },
    ],
  },
  'MacBook Neo': {
    description:
      "A slim, lightweight laptop built around Apple's M4 chip, with 16GB of unified memory " +
      'for smooth multitasking and a 512GB SSD for fast storage. The 13.6" Liquid Retina ' +
      'display is bright and color-accurate, and macOS keeps everything running efficiently ' +
      'with excellent battery life for a full day of work or study.',
    variants: [
      {
        name: 'Color',
        options: [
          { label: 'Space Gray', priceDelta: 0 },
          { label: 'Silver', priceDelta: 0 },
          { label: 'Midnight', priceDelta: 0 },
        ],
      },
      {
        name: 'Storage',
        options: [
          { label: '512GB', priceDelta: 0 },
          { label: '1TB', priceDelta: 200 },
        ],
      },
    ],
  },
  'ROG Zephyrus G14': {
    description:
      "A compact gaming laptop that doesn't compromise on power. The AMD Ryzen 9 processor " +
      'and RTX 4060 graphics handle modern games at high settings, while the 14" QHD+ ' +
      'display delivers sharp visuals in a body light enough to carry anywhere. 16GB of RAM ' +
      'and a 1TB SSD round out a laptop equally at home gaming or working.',
    variants: [
      {
        name: 'Color',
        options: [
          { label: 'Eclipse Gray', priceDelta: 0 },
          { label: 'Moonlight White', priceDelta: 0 },
        ],
      },
      {
        name: 'RAM',
        options: [
          { label: '16GB', priceDelta: 0 },
          { label: '32GB', priceDelta: 180 },
        ],
      },
    ],
  },
  'Lenovo Yoga Duet 7i': {
    description:
      'A 2-in-1 laptop-tablet hybrid with a 13.3" OLED display for vivid color and deep ' +
      'contrast. The included stylus makes note-taking and sketching natural, and the ' +
      "Intel Core i7 processor with 16GB of RAM keeps everything responsive whether you're " +
      'in laptop mode for work or tablet mode for reading and drawing.',
    variants: [
      {
        name: 'Storage',
        options: [
          { label: '512GB', priceDelta: 0 },
          { label: '1TB', priceDelta: 200 },
        ],
      },
    ],
  },
  'ROG Strix G16 Gaming': {
    description:
      'A high-performance 16" gaming laptop with an Intel Core i9 processor and RTX 4060 ' +
      'graphics for demanding titles at high frame rates. The 240Hz QHD+ display keeps fast ' +
      'action smooth and clear, and 16GB of RAM plus a 1TB SSD give you plenty of power and ' +
      'storage for gaming, streaming, or creative work.',
    variants: [
      {
        name: 'RAM',
        options: [
          { label: '16GB', priceDelta: 0 },
          { label: '32GB', priceDelta: 180 },
        ],
      },
      {
        name: 'Storage',
        options: [
          { label: '1TB SSD', priceDelta: 0 },
          { label: '2TB SSD', priceDelta: 150 },
        ],
      },
    ],
  },
  'MacBook Pro M5': {
    description:
      "Apple's most powerful laptop chip yet, built for serious creative and professional " +
      'workloads. The 16" Liquid Retina display is stunning for video editing and design, ' +
      '16GB of unified memory keeps heavy apps running smoothly, and the 1TB SSD gives you ' +
      "room for large media libraries. All wrapped in macOS's polished, efficient experience.",
    variants: [
      {
        name: 'Color',
        options: [
          { label: 'Space Black', priceDelta: 0 },
          { label: 'Silver', priceDelta: 0 },
        ],
      },
      {
        name: 'Storage',
        options: [
          { label: '1TB', priceDelta: 0 },
          { label: '2TB', priceDelta: 400 },
        ],
      },
    ],
  },
  'Mechanical Keyboard & Mouse Combo': {
    description:
      'A wireless mechanical keyboard and mouse combo with hot-swappable switches so you can ' +
      'customize the feel to your liking. RGB backlighting adds a personal touch, and dual ' +
      'connectivity over 2.4GHz or Bluetooth means it works with laptops, desktops, and ' +
      'tablets alike. A great everyday upgrade for typing and gaming.',
    variants: [
      {
        name: 'Switch Type',
        options: [
          { label: 'Red (Linear)', priceDelta: 0 },
          { label: 'Brown (Tactile)', priceDelta: 0 },
          { label: 'Blue (Clicky)', priceDelta: 0 },
        ],
      },
      {
        name: 'Color',
        options: [
          { label: 'Black', priceDelta: 0 },
          { label: 'White', priceDelta: 0 },
        ],
      },
    ],
  },
}
