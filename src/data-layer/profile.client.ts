"use client"

import updateBackendUser from "@/src/actions/update-user-action"
import { updateUser as updateLocalUser } from "@/src/indexdb/users"
import { ActionStateType } from "@/src/types/action-types"

export type ProfileSource = "backend" | "local"

// Evento para avisar a la UI que el perfil local cambió y debe recargarse.
export const LOCAL_USER_UPDATED_EVENT = "local-user-updated"

type ProfileUpdateAction = (prevState: ActionStateType, formData: FormData) => Promise<ActionStateType>

// Selecciona la action de actualización según origen del perfil.
export function getUpdateProfileAction(source: ProfileSource): ProfileUpdateAction {
  if (source === "local") return updateLocalUser
  return updateBackendUser
}
