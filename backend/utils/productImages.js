const unsplash = (id, width = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

export const PRODUCT_IMAGES = {
  'iPhone 15 Pro': [unsplash('1592750475338-74b7b21085ab'), unsplash('1496181133206-80ce9b88a853')],
  'Samsung Galaxy S24': [
    unsplash('1610945265064-0e34e5519bbf'),
    unsplash('1592750475338-74b7b21085ab'),
  ],
  'Sony WH-1000XM5': [
    unsplash('1505740420928-5e560c06d30e'),
    unsplash('1523275335684-37898b6baf30'),
  ],
  'Dell XPS 13': [unsplash('1496181133206-80ce9b88a853'), unsplash('1517336714731-489689fd1ca8')],
  "Men's Classic Denim Jacket": [
    unsplash('1551537482-f2075a1d41f2'),
    unsplash('1583743814966-8936f5b7be1a'),
  ],
  'Running Shoes': [unsplash('1542291026-7eec264c27ff'), unsplash('1560343090-f0409e92791a')],
  'Leather Wallet': [unsplash('1627123424574-724758594e93'), unsplash('1523170335258-f5ed11844a49')],
  'Ceramic Dinner Set': [
    unsplash('1603199506016-b9a594b593c0'),
    unsplash('1556909212-d5b604d0c90d'),
  ],
  'Stainless Steel Cookware': [
    unsplash('1556909212-d5b604d0c90d'),
    unsplash('1585515320310-259814833e62'),
  ],
  'Air Fryer 5L': [unsplash('1585515320310-259814833e62'), unsplash('1556909212-d5b604d0c90d')],
  'Yoga Mat Pro': [unsplash('1544367567-0f2fcb009e0b'), unsplash('1517836357463-d25dfeac3438')],
  'Adjustable Dumbbell Set': [
    unsplash('1517836357463-d25dfeac3438'),
    unsplash('1544367567-0f2fcb009e0b'),
  ],
};

// ---------------------------------------------------------------------------
// Real, name-matched photos (Wikimedia Commons) for every extra seed product.
// ---------------------------------------------------------------------------
const EXTRA_SEED_IMAGES = {
  'Samsung Galaxy Watch 6':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/AGENT_smartwatch_prototype_by_Secret_Labs_-_WP_20130627_031_%2815837480416%29.jpg/960px-AGENT_smartwatch_prototype_by_Secret_Labs_-_WP_20130627_031_%2815837480416%29.jpg',
  'iPad Air M2':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/IPad_2017_tablet.jpg/960px-IPad_2017_tablet.jpg',
  'JBL Flip 6 Speaker':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/JBL_Flip_3_bluetooth_speaker_%28DSCF2653%29.jpg/960px-JBL_Flip_3_bluetooth_speaker_%28DSCF2653%29.jpg',
  'Logitech MX Master 3S Mouse':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/SRI_Computer_Mouse.jpg/960px-SRI_Computer_Mouse.jpg',
  'Mechanical Keyboard K87':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Mechanical_keyboard_example.jpg/960px-Mechanical_keyboard_example.jpg',
  'GoPro Hero 12 Action Camera':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/ACT73-Action_Camera.jpg/960px-ACT73-Action_Camera.jpg',
  '65-inch 4K Smart TV':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/A_flat-screen_television.jpg/960px-A_flat-screen_television.jpg',
  'Wireless Earbuds Galaxy Buds3':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/ActiveSound_wireless_earbuds_by_Hykker_%28POJM200483%29.jpg/960px-ActiveSound_wireless_earbuds_by_Hykker_%28POJM200483%29.jpg',
  'Amazon Kindle Paperwhite':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Amazon_Kindle_Paperwhite_5_Eleventh_Generation_%28C2V2L3%29_6-inch_e-reader.jpg/960px-Amazon_Kindle_Paperwhite_5_Eleventh_Generation_%28C2V2L3%29_6-inch_e-reader.jpg',
  'Canon DSLR EOS 1500D':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/CANON_DSLR_CAMERA_WITH_TAMRON_70-300_VC_LENS.jpg/960px-CANON_DSLR_CAMERA_WITH_TAMRON_70-300_VC_LENS.jpg',
  'USB Podcast Microphone':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Studio_microphone_with_pop_shield.jpg/960px-Studio_microphone_with_pop_shield.jpg',
  'Smart Video Doorbell':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Ring_video_doorbell.jpg/960px-Ring_video_doorbell.jpg',
  'Wi-Fi 6 Router AX3000':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Wi-fi_router_in_North_York_Centre_station.jpg/960px-Wi-fi_router_in_North_York_Centre_station.jpg',
  'Power Bank 20000mAh':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/SAMSUNG_BATTERY_PACK_%28POWER_BANK%29_EB-PG850.jpg/960px-SAMSUNG_BATTERY_PACK_%28POWER_BANK%29_EB-PG850.jpg',
  "Women's Cotton Kurti":
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Indian_woman_wearing_a_kurti.jpg/960px-Indian_woman_wearing_a_kurti.jpg',
  "Men's Slim Fit Shirt":
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Dress_Shirt_%283161023616%29.jpg/960px-Dress_Shirt_%283161023616%29.jpg',
  'Sports Track Suit':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Kyle-cassidy-tracksuit.jpg/960px-Kyle-cassidy-tracksuit.jpg',
  'Handcrafted Jute Bag': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Jute_Bag.JPG/960px-Jute_Bag.JPG',
  'Brogue Formal Shoes':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Oxford_full_brogue_spectator_shoes.jpg/960px-Oxford_full_brogue_spectator_shoes.jpg',
  'Aviator Sunglasses': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Aviator_sunglasses.jpg/960px-Aviator_sunglasses.jpg',
  'Silk Designer Saree': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Saree_draping.jpg/960px-Saree_draping.jpg',
  "Men's Casual Sneakers":
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6c/North_Star_sneakers_%281%29.jpg/960px-North_Star_sneakers_%281%29.jpg',
  "Women's Leather Handbag":
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Handtooled_leather_handbag_Celtic_design.jpg/960px-Handtooled_leather_handbag_Celtic_design.jpg',
  "Men's Classic Wrist Watch":
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Analog_Wrist_Watch.jpg/960px-Analog_Wrist_Watch.jpg',
  "Kids' Denim Dungaree":
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Man_in_bill_cap_and_dungaree_coat1a34449v.jpg/960px-Man_in_bill_cap_and_dungaree_coat1a34449v.jpg',
  'Unisex Cozy Hoodie': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Young_man_with_hoodie.jpg/960px-Young_man_with_hoodie.jpg',
  'Sports Socks 6-Pack':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Nike_no-show_socks.JPG/960px-Nike_no-show_socks.JPG',
  'Non-Stick Cookware Set':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Descoware_Enamel_Cast_Iron_Cookware.jpg/960px-Descoware_Enamel_Cast_Iron_Cookware.jpg',
  'Mixer Grinder 750W':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/A_table-top_mixer-grinder_or_mixie.jpg/960px-A_table-top_mixer-grinder_or_mixie.jpg',
  'Rice Cooker 1.8L': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Rice-cooker.jpg/960px-Rice-cooker.jpg',
  'Espresso Coffee Maker':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9b/Espresso_machine_1.jpg/960px-Espresso_machine_1.jpg',
  'Memory Foam Mattress':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Eve_Sleep_mattress_kid.jpg/960px-Eve_Sleep_mattress_kid.jpg',
  'Cotton Bedsheet Set':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/A_bedsheet_and_pillow-case_seller.jpg/960px-A_bedsheet_and_pillow-case_seller.jpg',
  'LED Table Lamp':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Table_lamp_Gladiolus.jpg/960px-Table_lamp_Gladiolus.jpg',
  'Robotic Vacuum Cleaner':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Mopping_vacuum_cleaner_robotic.jpg/960px-Mopping_vacuum_cleaner_robotic.jpg',
  'RO Water Purifier':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Home_water_filters%2C_water_purifiers%2C_and_bottled_water_in_India.jpg/960px-Home_water_filters%2C_water_purifiers%2C_and_bottled_water_in_India.jpg',
  'Steam Iron & Garment Steamer':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Electric_steam_iron.jpg/960px-Electric_steam_iron.jpg',
  'Wooden Cutting Board Set':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/Wooden_Chopping_Board.jpg/960px-Wooden_Chopping_Board.jpg',
  'Smart Security Camera':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Security_camera%2C_September_2018.jpg/960px-Security_camera%2C_September_2018.jpg',
  '2-Slice Toaster':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Toaster%2C_maker_and_date_unknown_-_Franklin_Institute_-_DSC06674.jpg/960px-Toaster%2C_maker_and_date_unknown_-_Franklin_Institute_-_DSC06674.jpg',
  'Folding Treadmill':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/USMC-100514-M-1298M-056.jpg/960px-USMC-100514-M-1298M-056.jpg',
  '21-Speed MTB Cycle':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Bulls_Wild_Cup_1_%28Modell_2010%29_20100814.jpg/960px-Bulls_Wild_Cup_1_%28Modell_2010%29_20100814.jpg',
  'English Willow Cricket Bat':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Kashmir_willow_Cricket_Bat.jpg/960px-Kashmir_willow_Cricket_Bat.jpg',
  'Football Size 5':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1d/Football_Pallo_valmiina-cropped.jpg/960px-Football_Pallo_valmiina-cropped.jpg',
  'Badminton Racket Set':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Heads_of_badminton_raquets.jpg/960px-Heads_of_badminton_raquets.jpg',
  'Adjustable Skating Shoes':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Inline_skate_boot%2C_frame%2C_wheels%2C_bearings%2C_axle%2C_close_up.jpg/960px-Inline_skate_boot%2C_frame%2C_wheels%2C_bearings%2C_axle%2C_close_up.jpg',
  'Resistance Bands Set':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Woman_exercising_with_resistance_band_in_a_gym_setting.jpg/960px-Woman_exercising_with_resistance_band_in_a_gym_setting.jpg',
  '4-Person Camping Tent':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Camping_in_tent_alone_under_the_sky_in_night_with_dog_%282%29_04.jpg/960px-Camping_in_tent_alone_under_the_sky_in_night_with_dog_%282%29_04.jpg',
  'Trekking Backpack 60L':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/A_backpack_with_trekking_poles_and_shoes.jpg/960px-A_backpack_with_trekking_poles_and_shoes.jpg',
  'Swimming Goggles':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/Swimming_goggles.JPG/960px-Swimming_goggles.JPG',
};

for (const name of Object.keys(EXTRA_SEED_IMAGES)) {
  PRODUCT_IMAGES[name] = [EXTRA_SEED_IMAGES[name]];
}