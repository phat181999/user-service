import {SetMetadata} from "@nestjs/common";
import { UserRole } from "src/shared/interface/user.interface";

export const ROLE_KEY = "role";

export const Roles = (...role: UserRole[]) => SetMetadata(ROLE_KEY, role);
