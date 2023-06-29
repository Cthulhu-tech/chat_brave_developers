export class CreateMessageDto {
    message: string
    user: number
    room: number
}

class UserDto {
    user: string
}

export class SendOffer extends UserDto {
    offer: string
}

export class SendAnswer extends UserDto {
    answer: string
}

export class SendIceCandidate extends UserDto {
    candidate: string
}

export type JoinRoom = {
    room_id: string
    user_id: number
}
