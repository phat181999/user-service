import {SetMetadata} from "@nestjs/common";
import { UserRole } from "../../shared/interface";

export const ROLE_KEY = "role";

export const Roles = (...role: UserRole[]) => SetMetadata(ROLE_KEY, role);
