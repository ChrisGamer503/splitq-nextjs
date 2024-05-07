import { getCategories } from "@/actions/categories";
import ContainerManageCategories from "@/containers/ViewCategories";

export default async function manageCategories() {
    const categories = await getCategories()

    return(
        <ContainerManageCategories categorias={categories}/>
    )
}