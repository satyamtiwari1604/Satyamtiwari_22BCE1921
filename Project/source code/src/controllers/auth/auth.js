import { Customer, DeliveryPartner } from '../../models/user.js'
import jwt from 'jsonwebtoken'


const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1d' }
  )


  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }

  )

  return { accessToken, refreshToken }
}

export const loginCustomer = async (req, reply) => {
  try {
    const { phone } = req.body;
    let customer = await Customer.findOne({ phone });

    if (!customer) {
      customer = new Customer({
        phone,
        role: "Customer",
        isActivated: true
      })
      await customer.save()
    }
    const { accessToken, refreshToken } = generateTokens(customer)

    return reply.send({
      message: "Login Successful",
      accessToken,
      refreshToken,
      customer
    })

  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
}



export const loginDeliveryPartner = async (req, reply) => {

  try {
    const { email, password } = req.body;

    let deliveryPartner = await DeliveryPartner.findOne({ email });

    if (!deliveryPartner) {
      return reply.status(404).send({ message: "Delivery Partner not found" });
    }

    const isMatch = password === deliveryPartner.password

    if (!isMatch) {
      return reply.status(404).send({ message: "Invalid Credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(deliveryPartner);

    return reply.send({
      message: "Login Successful",
      accessToken,
      refreshToken,
      deliveryPartner
    })


  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error })
  }
}


export const refreshToken = async (req, reply) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return reply.status(401).send({ message: "Refresh token required" })
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    let user;

    if (decoded.role === "Customer") {
      user = await Customer.findById(decoded.userId)
    } else if (decoded.role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(decoded.userId);
    }
    else {
      return reply.status(403).send({ message: "Invalid Role" });
    }

    if (!user) {
      return reply.status(403).send({ message: "User not found" })
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    return reply.send({
      message: "Token Refreshed",
      accessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    return reply.status(403).send({ message: "Invaild Refresh Token" });

  }
}


export const fetchUser = async (req, reply) => {
  try {
    const { userId, role } = req.user;
    let user;

    if (role === "Customer") {
      user = await Customer.findById(userId);
    }
    else if (role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(userId);
    } else {
      return reply.status(403).send({ message: "User Not Found" })
    }

    if (!user) {
      return reply.status(404).send({ message: "User not found" })
    }

    return reply.send({
      message: "User fetched successfully",
      user,
    });

  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error })

  }
}