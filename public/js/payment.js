let providersLoaded = [];
let selectedProvider;
let refreshIntervalId;
const urlParams = new URLSearchParams(window.location.search);
const paymentLink = urlParams.get('paymentLink');
const phoneNumber = urlParams.get('phoneNumber');
const callbackUrl = urlParams.get('callback');
const getPaymenyProviders = async () => {
    const providers = await fetch('/api/v1/payment-providers').then(response => response.json());
    providersLoaded = providers;
    providers.forEach(provider => {
        const providerElement = document.createElement('label');
        providerElement.classList.add('flex', 'flex-col', 'items-center', 'cursor-pointer');
        providerElement.innerHTML = `
                <input type="radio" name="${provider.key}" value="${provider.key}" class="hidden"
                    onclick="updateInstructions('${provider.key}')">
                <img src="${provider.logo}" alt="${provider.key}"
                    class="w-24 h-12 object-contain mb-2">
                <span class="text-gray-700 text-center">${provider.name}</span>
        `;
        document.getElementById('providers').appendChild(providerElement);

    });
}
function updateInstructions(provider) {
    const providerDetails = providersLoaded.find(loaded => loaded.key === provider);
    selectedProvider = providerDetails;
    document.getElementById('instructions').innerHTML = providerDetails.instructions;
    const additionalFields = document.getElementById('additional-fields');
    additionalFields.innerHTML = '';
    if (providerDetails.fields && providerDetails.fields.length > 0 && additionalFields.children.length === 0) {
        additionalFields.classList.remove('hidden');
        providerDetails.fields.forEach(field => {
            const fieldElement = document.createElement('div');
            fieldElement.classList.add('mb-4');
            fieldElement.innerHTML = `
                <label class="block text-gray-700 text-sm font-bold mb-2" for="${field.key}">
                    ${field.label}
                </label>
                <input type="${field.type}" id="${field.key}" name="${field.key}" placeholder="${field.placeholder}" value="${field.key == "phoneNumber" ? phoneNumber : ""}"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            `;
            additionalFields.appendChild(fieldElement);

        });
        const buttonDiv = document.createElement('div');
        buttonDiv.classList.add('mt-6', 'text-center');
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'focus:outline-none', 'focus:shadow-outline', 'disabled:opacity-50', 'disabled:cursor-not-allowed', 'submit-button');
        submitButton.innerText = 'Payer Maintenant';
        buttonDiv.appendChild(submitButton);
        additionalFields.appendChild(buttonDiv);
    } else {
        //delete all children if fields are not required
        additionalFields.classList.remove('hidden');
        const buttonDiv = document.createElement('div');
        buttonDiv.classList.add('mt-6', 'text-center');
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'focus:outline-none', 'focus:shadow-outline', 'disabled:opacity-50', 'disabled:cursor-not-allowed', 'submit-button');
        submitButton.innerText = 'Payer Maintenant';
        buttonDiv.appendChild(submitButton);
        additionalFields.appendChild(buttonDiv);
    }

}
const getTransactionDetails = async (transactionId) => {
    const response = await fetch(`https://standard.paystack.co/charge/requery/${transactionId}`).then(response => response.json());
    if (response.status == "success" || (response.status == "0" && response.message != "Transaction not found" && !response.message.toString().includes("not completed"))) {
        clearInterval(refreshIntervalId);
        document.getElementsByClassName('container')[0].innerHTML = `<div class="container mx-auto p-4 text-center">
            <h1 class="text-3xl font-bold text-center mb-8">Paiement réussi ✅</h1>
            <a href="${response.details?.redirecturl ?? callbackUrl ?? "/"}" class="text-center">Continuer</a>
        </div>`;
        setTimeout(() => {
            window.location.href = `${response.details?.redirecturl ?? callbackUrl ?? "/"}`;
        },
            5000);
    }
    //return response;
}
const verify = async (id) => {
    refreshIntervalId = setInterval(async () => {
        getTransactionDetails(id);
    }, 10000);
}
const paymentForm = document.getElementById('payment-form');
paymentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector('.submit-button').disabled = true;
    document.querySelector('.submit-button').innerHTML = `<svg class="text-gray-300 animate-spin" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
width="24" height="24">
<path
d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
<path
d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-900">
</path>
</svg>`;
    if (selectedProvider.key == "CARD") {
        window.location.href = paymentLink;
    } else {
        const formJsonData = {
            provider: selectedProvider.key,
        };
        paymentForm.querySelectorAll('input').forEach((
            input) => {
            formJsonData[input.name] = input.value;
        });
        isLoading = true;
        fetch('/api/v1/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentLink: paymentLink,
                phoneNumber: formJsonData.phoneNumber,
                otp: formJsonData.otp,
                provider: formJsonData.provider,
            })
        }).then(response => response.json()).then(async data => {
            const details = data.details;
            if (data.status === 'success') {
                const redirectionUrl = details?.redirecturl ?? callbackUrl ?? "/";
                const qrCode = details?.qrCode;
                if (formJsonData.provider == "WAVE_CI") {
                    const qrCodeImageBase64 = details?.qrCodeImageBase64;
                    const qrCodeLink = await extractLink(qrCodeImageBase64);
                    document.getElementsByClassName('container')[0].innerHTML = `<div class="container mx-auto p-4 text-center">
            <h1 class="text-3xl font-bold text-center mb-8">Scannez ou Ouvrez Wave pour terminer votre paiement</h1>
            <img src="${qrCodeImageBase64}" alt="Wave QR Code" class="w-1/2 mx-auto">
            <a href='${qrCodeLink}' class="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed">Ouvrir Wave</a>
            <p class="text-center text-sm mt-2">(Redirection automatique dans 5 secondes)</p>
        <button onclick="verify('${data.transactionId}')" class="mt-5 bg-gray-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed">Verifier le paiement</button>
        </div>`;
                    if (qrCodeLink) {
                        setTimeout(() => {
                            window.location.href = qrCodeLink;
                        }, 5000);
                    } else {
                        verify(data.transactionId);
                    }


                } else if (formJsonData.provider == "ORANGE_CI") {
                    document.getElementsByClassName('container')[0].innerHTML = `<div class="container mx-auto p-4 text-center">
            <h1 class="text-3xl font-bold text-center mb-8">Paiement réussi ✅</h1>
            <a href="${redirectionUrl}" class="text-center">Continuer</a>
        </div>`;
                    setTimeout(() => {
                        window.location.href = redirectionUrl;
                    }, 20000);
                } else if (formJsonData.provider == "MTN_CI") {
                    document.getElementsByClassName('container')[0].innerHTML = `<div class="container mx-auto p-4 text-center">
                    <p>Tapez <a href="tel:*133#" target="_blank" class="text-blue-500">*133#</a> pour confirmer le paiement ou Scannez pour confirmer sur l\'application MTN MoMo.</p>
                    <img src="${qrCode}" alt="MTN QR Code" class="w-1/2 mx-auto">
                    </div>`;
                    verify(data.transactionId);
                }
            } else {
                document.getElementsByClassName('container')[0].innerHTML = `<div class="container mx-auto p-4 text-center">
            <h1 class="text-3xl font-bold text-center mb-8">Echec de paiement ❌</h1>
            <p class="text-center">Vous pouvez maintenant fermer cette page.</p>
        </div>`;
                setTimeout(() => {
                    window.location.href = redirectionUrl??"/payment";
                }, 20000);

            }
        }).catch(error => {
            document.getElementsByClassName('container')[0].innerHTML = `<div class="container mx-auto p-4 text-center">
                    <h1 class="text-3xl font-bold text-center mb-8">Echec de paiement ❌</h1>
                    <p class="text-center">${error?.message ?? "Une erreur est survenue lors du traitement de votre demande. Veuillez réessayer ultérieurement."}</p>
                </div>`;
            setTimeout(() => {
                window.location.href = redirectionUrl ?? "/"
            }, 20000);
        }
        );
    }
});
if (paymentLink) {
    getPaymenyProviders();
} else {
    const body = document.getElementsByTagName("body")[0];
    body.innerHTML = '<h1 class="text-3xl font-bold text-center mb-8">Veuillez entrer un lien de paiement</h1>';
}