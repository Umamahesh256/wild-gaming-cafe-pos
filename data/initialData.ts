import { CafeItem, Settings, Extra, Sale, KitchenSettlement } from '../types';

export const initialItems: CafeItem[] = [
  {
    "id": "v-s-1",
    "name": "Veg Manchuria",
    "category": "Veg Starters",
    "cafePrice": 160,
    "kitchenCost": 95,
    "status": "Available"
  },
  {
    "id": "v-s-2",
    "name": "Crispy Veg",
    "category": "Veg Starters",
    "cafePrice": 160,
    "kitchenCost": 95,
    "status": "Available"
  },
  {
    "id": "v-s-3",
    "name": "Veg 65",
    "category": "Veg Starters",
    "cafePrice": 175,
    "kitchenCost": 95,
    "status": "Available"
  },
  {
    "id": "v-f-1",
    "name": "Veg Fried Rice",
    "category": "Veg Fried Rice",
    "cafePrice": 130,
    "kitchenCost": 85,
    "status": "Available"
  },
  {
    "id": "v-f-2",
    "name": "Veg Manchurian Fried Rice",
    "category": "Veg Fried Rice",
    "cafePrice": 160,
    "kitchenCost": 95,
    "status": "Available"
  },
  {
    "id": "v-f-3",
    "name": "Jeera  Rice",
    "category": "Veg Fried Rice",
    "cafePrice": 175,
    "kitchenCost": 105,
    "status": "Available"
  },
  {
    "id": "v-f-4",
    "name": "Veg Schezwan Fried Rice",
    "category": "Veg Fried Rice",
    "cafePrice": 170,
    "kitchenCost": 95,
    "status": "Available"
  },
  {
    "id": "v-f-5",
    "name": "Veg Soft Fried Rice",
    "category": "Veg Fried Rice",
    "cafePrice": 130,
    "kitchenCost": 85,
    "status": "Available"
  },
  {
    "id": "v-f-6",
    "name": "Veg Manchurian Soft Fried Rice",
    "category": "Veg Fried Rice",
    "cafePrice": 160,
    "kitchenCost": 95,
    "status": "Available"
  },
  {
    "id": "v-n-1",
    "name": "Veg Noodles",
    "category": "Veg Noodles",
    "cafePrice": 130,
    "kitchenCost": 85,
    "status": "Available"
  },
  {
    "id": "nv-s-1",
    "name": "Chicken 65",
    "category": "Non Veg Starters",
    "cafePrice": 200,
    "kitchenCost": 145,
    "status": "Available"
  },
  {
    "id": "nv-s-2",
    "name": "Chilly Chicken",
    "category": "Non Veg Starters",
    "cafePrice": 200,
    "kitchenCost": 145,
    "status": "Available"
  },
  {
    "id": "nv-s-3",
    "name": "Chicken Manchuria",
    "category": "Non Veg Starters",
    "cafePrice": 200,
    "kitchenCost": 145,
    "status": "Available"
  },
  {
    "id": "nv-s-4",
    "name": "Chicken Pakodi",
    "category": "Non Veg Starters",
    "cafePrice": 230,
    "kitchenCost": 145,
    "status": "Available"
  },
  {
    "id": "nv-f-1",
    "name": "Double Egg Fried Rice",
    "category": "Non Veg Fried Rice",
    "cafePrice": 160,
    "kitchenCost": 95,
    "status": "Available"
  },
  {
    "id": "nv-f-2",
    "name": "Chicken Fried Rice",
    "category": "Non Veg Fried Rice",
    "cafePrice": 180,
    "kitchenCost": 95,
    "status": "Available"
  },
  {
    "id": "nv-f-3",
    "name": "Egg Schezwan Fried Rice",
    "category": "Non Veg Fried Rice",
    "cafePrice": 180,
    "kitchenCost": 95,
    "status": "Available"
  },
  {
    "id": "nv-f-4",
    "name": "Chicken Schezwan Fried Rice",
    "category": "Non Veg Fried Rice",
    "cafePrice": 200,
    "kitchenCost": 105,
    "status": "Available"
  },
  {
    "id": "nv-f-5",
    "name": "Double Egg Soft Fried Rice",
    "category": "Non Veg Fried Rice",
    "cafePrice": 160,
    "kitchenCost": 95,
    "status": "Available"
  },
  {
    "id": "nv-f-6",
    "name": "Chicken Soft Fried Rice",
    "category": "Non Veg Fried Rice",
    "cafePrice": 180,
    "kitchenCost": 95,
    "status": "Available"
  },
  {
    "id": "nv-n-1",
    "name": "Double Egg Noodles",
    "category": "Non Veg Noodles",
    "cafePrice": 160,
    "kitchenCost": 95,
    "status": "Available"
  },
  {
    "name": "Veg Fried Rice + Manchurian",
    "category": "Veg Combos",
    "cafePrice": 230,
    "kitchenCost": 135,
    "status": "Available",
    "id": "6de63eb3-fbab-4d7d-b2db-ec12103de80d"
  },
  {
    "name": "Chicken Fried Rice +  Chicken 65",
    "category": "Non Veg Combos",
    "cafePrice": 280,
    "kitchenCost": 185,
    "status": "Available",
    "id": "e1f04a05-1164-42fe-8ac3-3fe50da59537"
  },
  {
    "name": "Veg Fried Rice + Chilly Veg",
    "category": "Veg Combos",
    "cafePrice": 230,
    "kitchenCost": 135,
    "status": "Available",
    "id": "ab71ea0f-a389-4531-9a10-5d19a5cbbca1"
  },
  {
    "name": "Egg Fried Rice + Chilli Chicken",
    "category": "Non Veg Combos",
    "cafePrice": 280,
    "kitchenCost": 185,
    "status": "Available",
    "id": "c4523597-14c6-44ba-a222-a53ece931188"
  },
  {
    "name": "Hyderabadi Chicken Dum Biryani",
    "category": "Biryani",
    "cafePrice": 300,
    "kitchenCost": 150,
    "status": "Available",
    "id": "9b2f2d78-8282-41a6-ad39-51358b4212b1"
  },
  {
    "name": "Fry Piece Biryani",
    "category": "Biryani",
    "cafePrice": 320,
    "kitchenCost": 160,
    "status": "Available",
    "id": "c648dfc4-6a20-408a-aba3-e9a11a66a2a8"
  },
  {
    "name": "Chicken 65 Biryani",
    "category": "Biryani",
    "cafePrice": 340,
    "kitchenCost": 170,
    "status": "Available",
    "id": "7dae2287-ce86-4bd2-9e7c-17d31adefd6d"
  },
  {
    "name": "Chicken Noodles",
    "category": "Non Veg Noodles",
    "cafePrice": 180,
    "kitchenCost": 95,
    "status": "Available",
    "id": "26cdfb19-9f4e-4dd3-a725-e63702a1073d"
  },
  {
    "name": "Double Egg Soft Noodles",
    "category": "Non Veg Noodles",
    "cafePrice": 160,
    "kitchenCost": 95,
    "status": "Available",
    "id": "4061db66-eb64-4442-8742-7d2af8af1017"
  },
  {
    "name": "Chicken Soft Noodles",
    "category": "Non Veg Noodles",
    "cafePrice": 180,
    "kitchenCost": 95,
    "status": "Available",
    "id": "81dbf115-07ae-4cc2-859c-ebe53b242832"
  },
  {
    "name": "Egg Schezwan Noodles",
    "category": "Non Veg Noodles",
    "cafePrice": 180,
    "kitchenCost": 95,
    "status": "Available",
    "id": "40909c55-d3c9-482a-8bdc-e9149bfb18ed"
  },
  {
    "name": "Chicken Schezwan Noodles",
    "category": "Non Veg Noodles",
    "cafePrice": 200,
    "kitchenCost": 105,
    "status": "Available",
    "id": "439dc007-ceac-4b22-9adc-17e2ef465cde"
  },
  {
    "name": "Veg Soft Noodles",
    "category": "Veg Noodles",
    "cafePrice": 130,
    "kitchenCost": 85,
    "status": "Available",
    "id": "d9035395-2ea3-4455-bb47-f789254566b8"
  },
  {
    "name": "Veg Schezwan Noodles",
    "category": "Veg Noodles",
    "cafePrice": 170,
    "kitchenCost": 95,
    "status": "Available",
    "id": "eed19b1e-0b48-4068-a9c1-e7e38364586f"
  },
  {
    "name": "Manchurian Noodles",
    "category": "Veg Noodles",
    "cafePrice": 160,
    "kitchenCost": 95,
    "status": "Available",
    "id": "1d753495-53f4-4b6c-8e9e-b5afcd18291e"
  },
  {
    "name": "Manchurian Soft Noodles",
    "category": "Veg Noodles",
    "cafePrice": 160,
    "kitchenCost": 95,
    "status": "Available",
    "id": "351b27e2-dfbe-4d48-9905-6cbb3a61b959"
  }
];

export const initialSales: Sale[] = [
  {
    "timestamp": "2026-07-09T12:00:00.000Z",
    "items": [
      {
        "id": "05b9f533-3ffa-4d25-a9cb-a0afe55e1a9e",
        "itemId": "nv-s-1",
        "quantity": 1,
        "extras": [],
        "cafePrice": 200,
        "kitchenCost": 145
      },
      {
        "id": "ea20f6cc-5eb7-47fc-a375-145ce521fa10",
        "itemId": "nv-s-2",
        "quantity": 1,
        "extras": [],
        "cafePrice": 200,
        "kitchenCost": 145
      },
      {
        "id": "67ed097f-6446-490d-8dba-2d05e500c213",
        "itemId": "nv-s-2",
        "quantity": 1,
        "extras": [],
        "cafePrice": 200,
        "kitchenCost": 145
      },
      {
        "id": "2f79851c-9b29-4d60-a739-261cb3430d12",
        "itemId": "v-f-1",
        "quantity": 1,
        "extras": [],
        "cafePrice": 130,
        "kitchenCost": 85
      }
    ],
    "totalAmount": 730,
    "totalKitchenCost": 520,
    "totalProfit": 210,
    "paymentType": "Cash",
    "id": "8e3afd8d-0448-4f62-9c5a-07030f70164d"
  },
  {
    "timestamp": "2026-07-10T13:35:58.041Z",
    "items": [
      {
        "id": "5e041352-706e-4ccf-91cc-1eeb974c05d2",
        "itemId": "nv-f-2",
        "quantity": 1,
        "extras": [],
        "cafePrice": 180,
        "kitchenCost": 95
      }
    ],
    "totalAmount": 180,
    "totalKitchenCost": 95,
    "totalProfit": 85,
    "paymentType": "Cash",
    "id": "1df2126a-79cf-4106-aeb5-6516ca94a129"
  },
  {
    "timestamp": "2026-07-09T12:00:00.000Z",
    "items": [
      {
        "id": "35d65cc5-449d-423f-894f-92553ecafea7",
        "itemId": "nv-f-4",
        "quantity": 1,
        "extras": [],
        "cafePrice": 200,
        "kitchenCost": 105
      }
    ],
    "totalAmount": 200,
    "totalKitchenCost": 105,
    "totalProfit": 95,
    "paymentType": "Cash",
    "id": "50af483a-1c53-4ae5-92c0-cee51457cbe3"
  },
  {
    "timestamp": "2026-07-10T12:00:00.000Z",
    "items": [
      {
        "id": "cfe47105-c83c-49f8-b57c-98c0aadd6d9f",
        "itemId": "81dbf115-07ae-4cc2-859c-ebe53b242832",
        "quantity": 1,
        "extras": [
          {
            "name": "Extra Chicken",
            "cafePrice": 20,
            "kitchenCost": 10,
            "isActive": true,
            "id": "045a5532-d579-4767-987b-32c57c067279"
          }
        ],
        "cafePrice": 180,
        "kitchenCost": 95
      }
    ],
    "totalAmount": 200,
    "totalKitchenCost": 105,
    "totalProfit": 95,
    "paymentType": "Cash",
    "id": "59f7ea41-53e9-4823-ba46-6ae6404c8655"
  },
  {
    "timestamp": "2026-07-11T12:04:58.652Z",
    "items": [
      {
        "id": "c0b0a68d-c4c2-4e98-87ac-d3eacde982c0",
        "itemId": "26cdfb19-9f4e-4dd3-a725-e63702a1073d",
        "quantity": 1,
        "extras": [],
        "cafePrice": 180,
        "kitchenCost": 95
      }
    ],
    "totalAmount": 180,
    "totalKitchenCost": 95,
    "totalProfit": 85,
    "paymentType": "Cash",
    "id": "51cd6f23-38c5-4f21-9e73-0053541e4902"
  }
];

export const initialExtras: Extra[] = [
  {
    "name": "Extra Chicken",
    "cafePrice": 20,
    "kitchenCost": 10,
    "isActive": true,
    "id": "045a5532-d579-4767-987b-32c57c067279"
  },
  {
    "name": "Extra Egg",
    "cafePrice": 20,
    "kitchenCost": 10,
    "isActive": true,
    "id": "e3cc3700-ad79-4b67-8a4f-27d2e4065174"
  }
];

export const initialSettings: Settings = {
  "cafeName": "Wild Gaming Cafe",
  "phone": "+91 9876543210",
  "address": "123 Coffee Street, Food City",
  "kitchenName": "Cloud Kitchen Hub"
};

export const initialSettlements: KitchenSettlement[] = [
  {
    "kitchenPayable": 825,
    "amountPaid": 825,
    "remainingAmount": 0,
    "status": "Paid",
    "paymentMethod": "Cash",
    "notes": "",
    "id": "7e348046-0dd8-4075-a181-62ea22bba6a4",
    "timestamp": "2026-07-11T06:09:40.531Z"
  }
];
