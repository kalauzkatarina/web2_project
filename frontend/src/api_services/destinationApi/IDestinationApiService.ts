import type { CreateDestinationDto } from "../../models/destinations/CreateDestinationDto";
import type { DestinationDto } from "../../models/destinations/DestinationDto";
import type { UpdateDestinationDto } from "../../models/destinations/UpdateDestinationDto";

export interface IDestinationApiService {

    getByPlan(planId: string): Promise<DestinationDto[]>;

    getById(id: string, shareToken?: string): Promise<DestinationDto>;

    create( data: CreateDestinationDto, shareToken?: string): Promise<DestinationDto>;

    update(id: string,data: UpdateDestinationDto,shareToken?: string): Promise<void>;

    delete(id: string,shareToken?: string): Promise<void>;
}