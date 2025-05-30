import { tryCatchInfra } from "@/utils/tryCatchInfra";
import { API } from "../config";
import { IRideDetailsDTO } from "./types";
import { IResponse } from "@/@types/response";

export async function tryGetRideDetail(rideId: number) {
	const url = `/rides/${rideId}/`;

	const response = await tryCatchInfra({
		fn: () => API.get<IRideDetailsDTO>(url),
		titleMessage: "Erro ao buscar detalhes da corrida",
		context: {
			name: "tryGetRideDetail",
			rideId,
		},
	});

	return response.data;
}

export async function tryRejectRide(rideId: number) {
	const url = `/rides/${rideId}/update_ride_status/`;

	const response = await tryCatchInfra({
		fn: () => API.patch(url, { status: "rejected" }),
		titleMessage: "Erro ao rejeitar corrida",
		context: {
			name: "tryRejectRide",
			rideId,
		},
	});

	return response.data;
}

export async function tryAcceptRide(rideId: number) {
	const url = `/rides/${rideId}/accept_ride/`;

	const response = await tryCatchInfra({
		fn: () => API.patch<IResponse>(url, { status: "accepted" }),
		titleMessage: "Erro ao aceitar corrida",
		context: {
			name: "tryAcceptRide",
			rideId,
		},
	});

	return response.data;
}

export async function trySendPhotos(rideId: number, formData: FormData) {
	const url = `/rides/${rideId}/add-photos/`;

	const response = await tryCatchInfra({
		fn: () =>
			API.post<string[]>(url, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}),
		titleMessage: "Erro ao enviar fotos",
		context: {
			name: "trySendPhotos",
			rideId,
		},
	});

	return response.data;
}

export async function tryFinishRide(rideId: number) {
	const url = `/rides/${rideId}/update_ride_status/`;

	const response = await tryCatchInfra({
		fn: () => API.patch<IResponse>(url, { status: "completed" }),
		titleMessage: "Erro ao finalizar corrida",
		context: {
			name: "tryFinishRide",
			rideId,
		},
	});

	return response.data;
}
