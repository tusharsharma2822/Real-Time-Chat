import userModel from "../models/user.model.js";

export const creteUser = async ({email, password}) => {
    if(!email){
        throw new Error("Email is required!");
    }

    if(!password){
        throw new Error("Password must be atleast 3 Characters Long");
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userModel.create({
        email,
        password: hashedPassword
    });

    return user;
}