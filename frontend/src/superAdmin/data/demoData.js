export const initialRestaurants = [
  { id: "1", name: "Spice Garden", owner: "Amit Sharma", email: "amit@example.com", category: "Indian", location: "Saharanpur", orders: 1248, rating: 4.8, status: "Approved", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120", joined: "12 Oct 2026" },
  { id: "2", name: "Burger House", owner: "Rahul Verma", email: "rahul@example.com", category: "Fast Food", location: "Meerut", orders: 856, rating: 4.6, status: "Approved", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120", joined: "10 Oct 2026" },
  { id: "3", name: "Pizza Palace", owner: "Neha Singh", email: "neha@example.com", category: "Pizza", location: "Noida", orders: 0, rating: 0, status: "Pending", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=120", joined: "15 Oct 2026" },
  { id: "4", name: "Green Bowl", owner: "Priya Gupta", email: "priya@example.com", category: "Healthy Food", location: "Delhi", orders: 642, rating: 4.7, status: "Approved", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120", joined: "08 Oct 2026" },
  { id: "5", name: "Wok & Roll", owner: "Karan Malhotra", email: "karan@example.com", category: "Chinese", location: "Ghaziabad", orders: 0, rating: 0, status: "Pending", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=120", joined: "14 Oct 2026" },
  { id: "6", name: "Royal Biryani", owner: "Mohit Kumar", email: "mohit@example.com", category: "Biryani", location: "Lucknow", orders: 934, rating: 4.9, status: "Rejected", image: "https://images.unsplash.com/photo-1563379091339-03246963d51a?w=120", joined: "07 Oct 2026" },
];

export const demoOrders = [
  { id: "FD-1025", customer: "Rahul Sharma", restaurant: "Pizza Palace", amount: 649, status: "Delivered", date: "22 Oct 2026" },
  { id: "FD-1024", customer: "Priya Verma", restaurant: "Burger House", amount: 399, status: "Preparing", date: "22 Oct 2026" },
  { id: "FD-1023", customer: "Aman Kumar", restaurant: "Spice Garden", amount: 820, status: "Pending", date: "21 Oct 2026" },
  { id: "FD-1022", customer: "Neha Singh", restaurant: "The Food Hub", amount: 299, status: "Cancelled", date: "21 Oct 2026" },
  { id: "FD-1021", customer: "Vikas Gupta", restaurant: "Pizza Palace", amount: 550, status: "Delivered", date: "20 Oct 2026" },
];

export const demoCustomers = [
  { id: "CU-1001", name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 98765 43210", orders: 18, status: "Active" },
  { id: "CU-1002", name: "Priya Verma", email: "priya@example.com", phone: "+91 98765 43211", orders: 12, status: "Active" },
  { id: "CU-1003", name: "Aman Kumar", email: "aman@example.com", phone: "+91 98765 43212", orders: 4, status: "Active" },
  { id: "CU-1004", name: "Neha Singh", email: "neha@example.com", phone: "+91 98765 43213", orders: 0, status: "Inactive" },
];

export const demoReviews = [
  { id: 1, customer: "Rahul Sharma", restaurant: "Pizza Palace", rating: 5, comment: "Amazing taste and quick delivery.", date: "22 Oct 2026" },
  { id: 2, customer: "Priya Verma", restaurant: "Burger House", rating: 4, comment: "Good food, packaging could be better.", date: "21 Oct 2026" },
  { id: 3, customer: "Aman Kumar", restaurant: "Spice Garden", rating: 2, comment: "Order arrived late.", date: "20 Oct 2026" },
];
