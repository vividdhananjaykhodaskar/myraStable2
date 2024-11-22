const fetchFetchURl = "https://pponlineordercb.petpooja.com/mapped_restaurant_menus";
const saveOrderURl = "https://pponlineordercb.petpooja.com/save_order";

export async function getMunuList(restaurant: string) {
  const headerOptions: any = {
    "Content-Type": "application/json",
    "app-key": process.env.PETPOOJA_APP_KEY,
    "app-secret": process.env.PETPOOJA_APP_SECRET,
    "access-token": process.env.PETPOOJA_APP_TOKEN,
  };
  return fetch(fetchFetchURl, {
    method: "post",
    headers: headerOptions,
    cache: "no-store",
    body: JSON.stringify({
      restID: restaurant,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success === "1") {
        return res;
      }
      return false;
    })
    .catch(() => false);
}

export async function createOrder(data: any) {
  const headerOptions: any = {
    "Content-Type": "application/json",
  };
  const new_order = {
    app_key: process.env.PETPOOJA_APP_KEY,
    app_secret: process.env.PETPOOJA_APP_SECRET,
    access_token: process.env.PETPOOJA_APP_TOKEN,
    orderinfo: data,
  };
  const chatCompletion = await fetch(saveOrderURl, {
    method: "post",
    headers: headerOptions,
    cache: "no-store",
    body: JSON.stringify(new_order),
  })
    .then((res) => res.json())
    .then((res) => res)
    .catch(() => false);

  return chatCompletion;
}
