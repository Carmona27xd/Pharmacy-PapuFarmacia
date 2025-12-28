# PRODUCT

## New Product interface

    idProductType: number;
    // Optional for non medicine products
    chemicalName?: string;
        comercialName: string;
    photoId: string;
    description: string;
    price: number;
    // Optional for non medicine products
        dateOut?: Date;
    // Remove this attribute and add the stock in another flow.
        newStock: number;
    batch: string;
    provider: string;
    // Optional for non medicine products
        pharmaceutical?: string; | pharmaceuticalId: number;

## Get Photo interface

    medicine_picture?: string;
    user_id: number;
    created_at: string;
    updated_at: string;

# USER

## Login interface

    identifier: string;
    password: string;

## New User interface

    email: string;
    full_name: string;
    username: string;
    password: string;

## Get Profile Photo interface

    profile_picture: string;
    user_id: number;
    created_at: string;
    updated_at: string;
