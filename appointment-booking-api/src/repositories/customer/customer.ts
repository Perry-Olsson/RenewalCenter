import { EmailError, LoginError, RequestBodyError } from "../../utils";
import validator from "email-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Prisma } from ".prisma/client";
import config from "../../config";
import { CustomerResponse, DecodedToken, LoginCustomer } from "./types";
import { prisma } from "../../prisma";

class _Customer {
  public async initialize(reqBody: any): Promise<Prisma.CustomerCreateInput> {
    if (typeof reqBody !== "object") throw new RequestBodyError(reqBody);

    if (!this._validateEmail(reqBody.email))
      throw new EmailError(reqBody.email);

    if (reqBody.type === "GUEST") delete reqBody.password;
    else {
      reqBody.password = await bcrypt.hash(reqBody.password, 8);
    }

    return reqBody as Prisma.CustomerCreateInput;
  }

  private _validateEmail(email: any): boolean {
    return validator.validate(email);
  }

  public async login({ email, password }: any): Promise<CustomerResponse> {
    const customer: LoginCustomer | null = await prisma.customer.findUnique({
      where: { email },
      select: this.loginSelectStatement,
    });

    const user = await this._isUser(customer, password);
    if (!user) throw new LoginError();

    return this._createLoginResponse(user);
  }

  private async _isUser(
    customer: LoginCustomer | null,
    password: string
  ): Promise<LoginCustomer | false> {
    if (!customer || !customer.password) return false;

    const isValidPassword = await bcrypt.compare(password, customer.password);
    if (!isValidPassword) return false;
    return customer;
  }

  private _createLoginResponse(customer: LoginCustomer): CustomerResponse {
    const token = this.createToken(customer.email);

    delete customer.password;
    return { customer, token };
  }

  public createToken(email: string) {
    return jwt.sign({ email }, config.jwtSecret);
  }

  public decodeToken(token: string) {
    const decodedToken = jwt.verify(token, config.jwtSecret) as DecodedToken;

    return decodedToken;
  }

  public defaultSelect = {
    id: true,
    email: true,
    phoneNumber: true,
    type: true,
    firstName: true,
    lastName: true,
  };

  public createSelectStatement = this.defaultSelect;

  public loginSelectStatement = { ...this.defaultSelect, password: true };
}

export const customer = new _Customer();