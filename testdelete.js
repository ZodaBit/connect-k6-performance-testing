export function setup() {
  console.log("🔧 Setup stage executed!");
  return { message: "Hello from setup" };
}

export default function (data) {
  console.log("🚀 Default function running");
  console.log("Data from setup:", data);
}
