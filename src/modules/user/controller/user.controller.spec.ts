import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller"

describe('UserController', ()=> {
    let module: TestingModule;
    let controller: UserController;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            controllers: [UserController]
        }).compile();

        controller = module.get<UserController>(UserController);
    })

    it('should', () => {
        expect(controller).toBeDefined();
    })
})