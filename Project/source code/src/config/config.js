import "dotenv/config.js";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";



export const PORT = process.env.PORT || 3000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD


const MongoDBStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
})

sessionStore.on("error", (error) => {
  console.log("Session store error", error);
})


export const authenticate = async (email, password) => {
  //uncomment this when creating Admin first time 
  if (email && password) {
    if (email == 'satyam.stark77@gmail.com' && password === "01234567") {
      return Promise.resolve({ email: email, password: password });
    } else {
      return null;
    }
  }


  //uncomment this when create admin ON Database
  // if (email && password) {
  //   const user = await Admin.findById({ email });
  //   if (!user) {
  //     return null;
  //   }
  //   if (user.password === password) {
  //     return Promise.resolve({ email: email, password: password });
  //   } else {
  //     return null;
  //   }
  // }

  return null;

}