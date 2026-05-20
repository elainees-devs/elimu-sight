export type TeacherFormData = {
  fullName: string
  email: string
  password: string
}

export type TeacherUpdateInput = {
  fullName?: string
  email?: string
}

export type ClassAssignment = {
  classId: string
}
