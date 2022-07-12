import { Test, TestingModule } from '@nestjs/testing';
import { GaController } from './ga.controller';

describe('GaController', () => {
    let controller: GaController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GaController],
        }).compile();

        controller = module.get<GaController>(GaController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
