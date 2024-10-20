

export const getTreeValues = (data: any[], isSelected?: boolean) => {
    const values: any = [];

    const items = data.filter((element) => !element.parentId);

    const newItems = items.map((item) =>
        isSelected ? {
            label: item.title,
            value: item._id,
        } : {
            ...item, key: item._id
        }
    );

    newItems.forEach((item) => {
        const children = changeMenu(
            data,
            isSelected ? item.value : item._id,
            isSelected ?? false
        );

        values.push({
            ...item,
            children,
        });
    });

    return values;
};

const changeMenu = (data: any[], id: string, isSelected: boolean) => {
    const items: any = [];
    const datas = data.filter((element) => element.parentId === id);

    datas.forEach((val) =>
        items.push(
            isSelected ? {
                label: val.title,
                value: val._id,
                children: changeMenu(data, val._id, isSelected),
            } : {
                ...val,
                key: val._id,
                children: changeMenu(data, val._id, isSelected),
            }
        )
    );

    return items;
};
