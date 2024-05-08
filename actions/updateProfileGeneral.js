"use server"
import prisma from "@/db/prisma";
import { authUser } from "@/lib/authUser";
import { generarCodigoVerificacion } from "@/lib/code";
import { sendVerificationChangeEmailApi } from "@/lib/emailAPI";
import { revalidatePath } from "next/cache";

export async function updateProfileGeneral(data) {
    try {
        const user = await authUser();
        const test = process.env.DEPLOYMENT


        if (data?.email) {

            const sameEmailUser = await prisma.users.findFirst({
                where: {
                    email: data.email
                }
            })

            if (sameEmailUser) return { error: "Usuario con el mismo email" }
            if (test != "local") {

                const updatableEmail = data.email
                delete data.email;

                const emailToken = generarCodigoVerificacion();


                data.updatableEmail = updatableEmail;
                data.emailToken = emailToken
            }

            const updated = await prisma.users.update({
                where: {
                    id: user.id
                },
                data
            })

            await sendVerificationChangeEmailApi(updated.id);

            revalidatePath("/")
            return { user: updated, email: test != "local" };
        }



        const updatedUser = await prisma.users.update({
            where: {
                id: user.id
            },
            data
        })

        revalidatePath("/")
        return { user: updatedUser }
    } catch (error) {
        console.log(error)
        return { error: "Hubo un error en el servidor" }
    }
}
