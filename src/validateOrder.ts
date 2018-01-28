function validateOrder() {
    // capture the contextual variables we'll need
    var request = getContext().getRequest();

    // run the core logic of the trigger
    validateOrderImpl(request);
}

function validateOrderImpl(request: IRequest) {
    if (request.getOperationType() == "Delete") {
        // this is not a 'Create' or 'Replace' operation, so we can ignore it in this trigger
        return;
    }

    var document = request.getBody() as BaseDocument;
    if (document.type != DocumentTypes.Order) {
        // this is not an order, so we can ignore it in this trigger
        return;
    }

    var orderDocument = <OrderDocument>document;
    if (orderDocument.customerId != undefined) {
        orderDocument.customer = {
            id: orderDocument.customerId
        };   
        orderDocument.customerId = undefined;
    }
    else if (orderDocument.customer == undefined || orderDocument.customer.id == undefined) {
        throw new Error("Customer ID is missing. Customer ID must be provided within the customer.id property.")
    }

    // otherwise, this document is OK to leave as-is
}

const enum DocumentTypes {
    Order = "order"
}

interface BaseDocument {
    id: string,
    type: DocumentTypes
}

interface OrderDocument extends BaseDocument {
    customerId: string,
    customer: {
        id: string
    }
}