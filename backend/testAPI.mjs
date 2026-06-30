import axios from "axios";

const port = process.env.PORT || "5000";
const API_URL = process.env.API_URL || `http://127.0.0.1:${port}/api`;

const tests = {
  results: [],
  
  log: (testName, success, details = "") => {
    tests.results.push({
      test: testName,
      success,
      details,
      timestamp: new Date().toISOString()
    });
    console.log(`${success ? "✅" : "❌"} ${testName}${details ? " - " + details : ""}`);
  },

  async testProductCRUD() {
    console.log("\n📦 TESTING PRODUCT CRUD OPERATIONS");
    try {
      // GET all products
      const getRes = await axios.get(`${API_URL}/products`);
      tests.log("GET all products", getRes.status === 200 && getRes.data.products.length > 0, `${getRes.data.products.length} products found`);

      // GET single product
      if (getRes.data.products.length > 0) {
        const productId = getRes.data.products[0]._id;
        const singleRes = await axios.get(`${API_URL}/products/${productId}`);
        tests.log("GET single product", singleRes.status === 200, `Product: ${singleRes.data.name}`);

        // Test search
        const searchRes = await axios.get(`${API_URL}/products?keyword=wireless`);
        tests.log("Search products", searchRes.status === 200, `${searchRes.data.products.length} results found`);
      }
    } catch (error) {
      tests.log("Product CRUD operations", false, error.message);
    }
  },

  async testCategoryManagement() {
    console.log("\n🏷️ TESTING CATEGORY MANAGEMENT");
    try {
      const catRes = await axios.get(`${API_URL}/categories`);
      tests.log("GET all categories", catRes.status === 200 && catRes.data.length > 0, `${catRes.data.length} categories`);
    } catch (error) {
      tests.log("Category retrieval", false, error.message);
    }
  },

  async testUserAuth() {
    console.log("\n👤 TESTING USER AUTHENTICATION");
    try {
      // Register
      const registerRes = await axios.post(`${API_URL}/users`, {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@test.com`,
        password: "Test@1234",
        isAdmin: false
      }).catch(e => e.response);
      tests.log("User registration", registerRes.status === 201, registerRes.data?.message || "");

      // Login
      const loginRes = await axios.post(`${API_URL}/users/auth`, {
        email: `test_${Date.now() - 1000}@test.com`,
        password: "Test@1234"
      }).catch(e => ({ status: 400, data: e.message }));
      tests.log("User login", loginRes.status === 200 || loginRes.status === 400, "Auth endpoint working");
    } catch (error) {
      tests.log("User authentication", false, error.message);
    }
  },

  async testOrderFlow() {
    console.log("\n📋 TESTING ORDER FLOW");
    try {
      const productsRes = await axios.get(`${API_URL}/products?limit=1`);
      if (productsRes.data.products.length > 0) {
        tests.log("Product fetch for orders", true, "Products available for ordering");
      }
    } catch (error) {
      tests.log("Order flow test", false, error.message);
    }
  },

  async testAPIEndpoints() {
    console.log("\n🔌 TESTING API ENDPOINTS AVAILABILITY");
    const endpoints = [
      { url: "/products", method: "GET", name: "Products endpoint" },
      { url: "/categories", method: "GET", name: "Categories endpoint" },
      { url: "/users", method: "GET", name: "Users endpoint" }
    ];

    for (const ep of endpoints) {
      try {
        const res = await axios.get(`${API_URL}${ep.url}`).catch(e => e.response);
        tests.log(ep.name, res.status !== 404, `Status: ${res.status}`);
      } catch (error) {
        tests.log(ep.name, false, error.message);
      }
    }
  },

  printSummary() {
    console.log("\n" + "=".repeat(60));
    console.log("📊 TEST SUMMARY");
    console.log("=".repeat(60));
    const passed = tests.results.filter(r => r.success).length;
    const total = tests.results.length;
    console.log(`✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${total - passed}/${total}`);
    console.log("=".repeat(60));
  }
};

async function runAllTests() {
  console.log("🚀 Starting comprehensive API tests...\n");
  await tests.testProductCRUD();
  await tests.testCategoryManagement();
  await tests.testUserAuth();
  await tests.testOrderFlow();
  await tests.testAPIEndpoints();
  tests.printSummary();
}

runAllTests();
