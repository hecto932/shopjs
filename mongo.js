db.orders.inserMany([
  {
    cust_id: "A123",
    amount: 500,
    status: "A"
  },
  {
    cust_id: "A123",
    amount: 250,
    status: "A"
  },
  {
    cust_id: "B212",
    amount: 200,
    status: "A"
  },
  {
    cust_id: "A123",
    amount: 500,
    status: "D"
  }
]);

db.orders.aggregate([
  { $match: { status: "A" } },
  { $group: { _id: "$cust_id", total: { $sum: "$amount" } } }
])


// MAP REDUCE

var mapFun = function () {
  emit(this.cust_id, this.amount);
}

var reduceFun = function (key, values) {
  return ' ' + values;
}

var output = {
  query: { status: "A" },
  out: "order_total"
}

db.orders.mapReduce(mapFun, reduceFun, output)