import { ApiError, hashPassword, prisma } from "@utils/index";
import { CreateUserInput } from "schemas";

export class AuthService {
  // register logic
  async registerUser(input: CreateUserInput) {
    // check if email already exists
    const existingUser = await prisma.users.findUnique({
      where: { email: input.email },
    });
    if (existingUser) {
      throw new ApiError(400, "Email already in use");
    }

    // hash password
    const passwordHash = await hashPassword(input.password);

    // map input to DB format
    const userData = {
      full_name: input.fullName,
      email: input.email,
      password_hash: passwordHash,
      role: input.role,
      school_id: input.schoolId,
      is_active: true,
    };
    
    try {
      // create user in DB
      const newUser = await prisma.users.create({
        data: userData,
      });

      // save user to DB
    } catch (error) {
      console.error("Error creating user:", error);
      throw new ApiError(500, "Failed to create user");
    }
  }

  // verify token logic
  // refresh token logic
  // validate school access logic
  // login logic
  // get current user logic
  // reset password logic
}
