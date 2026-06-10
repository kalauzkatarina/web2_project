import api from "../api";
import type { IDestinationApiService } from "./IDestinationApiService";
import type { DestinationDto } from "../../models/destinations/DestinationDto";
import type { CreateDestinationDto } from "../../models/destinations/CreateDestinationDto";
import type { UpdateDestinationDto } from "../../models/destinations/UpdateDestinationDto";

export const destinationService: IDestinationApiService = {

    async getByPlan(
        planId: string
    ): Promise<DestinationDto[]> {

        const res =
            await api.get<DestinationDto[]>(
                `/destination/plan/${planId}`
            );

        return res.data;
    },

    async getById(
        id: string
    ): Promise<DestinationDto> {

        const res =
            await api.get<DestinationDto>(
                `/destination/${id}`
            );

        return res.data;
    },

    async create(
        data: CreateDestinationDto
    ): Promise<DestinationDto> {

        const res =
            await api.post<DestinationDto>(
                "/destination",
                data
            );

        return res.data;
    },

    async update(
        id: string,
        data: UpdateDestinationDto
    ): Promise<void> {

        await api.put(
            `/destination/${id}`,
            data
        );
    },

    async delete(
        id: string
    ): Promise<void> {

        await api.delete(
            `/destination/${id}`
        );
    },
};