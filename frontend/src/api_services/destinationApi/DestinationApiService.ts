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

    async getById(id: string, shareToken?: string): Promise<DestinationDto> {
        const params = shareToken ? `?shareToken=${shareToken}` : "";
        const res = await api.get<DestinationDto>(`/destination/${id}${params}`);
        return res.data;
    },

    async create(
        data: CreateDestinationDto, shareToken?: string
    ): Promise<DestinationDto> {

        const params = shareToken
            ? `?shareToken=${shareToken}`
            : "";

        const res =
            await api.post<DestinationDto>(
                `/destination${params}`,
                data
            );

        return res.data;
    },

    async update(
        id: string,
        data: UpdateDestinationDto,
        shareToken?: string
    ): Promise<void> {

        const params = shareToken
            ? `?shareToken=${shareToken}`
            : "";

        await api.put(
            `/destination/${id}${params}`,
            data
        );
    },

    async delete(
        id: string,
        shareToken?: string
    ): Promise<void> {

        const params = shareToken
            ? `?shareToken=${shareToken}`
            : "";

        await api.delete(
            `/destination/${id}${params}`
        );
    },
};