import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/model/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async signup(user: User): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    const reqBody = {
      fullname: user.fullname,
      email: user.email,
      password: hash,
    };
    const newUser = new this.userModel(reqBody);
    return newUser.save();
  }

  async signin(user: User, jwt: JwtService): Promise<any> {
    const foundUser = await this.userModel
      .findOne({ email: user.email })
      .exec();
    if (foundUser) {
      const { password } = foundUser;
      if (bcrypt.compare(user.password, password)) {
        const payload = { email: user.email };
        return {
          token: jwt.sign(payload),
        };
      }
      throw new HttpException(
        'Incorrect Username or Password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    throw new HttpException(
      'Incorrect Username or Password',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async getOne(email): Promise<User> {
    const getUser = await this.userModel.findOne({ email }).exec();
    return getUser;
  }
}
