const {test, expect} = require("@playwright/test");
const { resolve } = require("path");
const {Ajv} = require("ajv");

const ajv = new Ajv()

test.describe('Positive Test Cases', () => {

    const baseUrl = "https://reqres.in/";

    test('Test Case GET Single Users', async ({ request}) => {
        const response = await request.get(baseUrl+ "api/users/2");
        
        expect(response.status()).toBe(200);

        const responseData = await response.json()
        expect (responseData.data["id"]).toBe(2)
        expect (responseData.data["email"]).toBe("janet.weaver@reqres.in")
        expect (responseData.support["text"]).toBe("Tired of writing endless social media content? Let Content Caddy generate it for you.")

        const valid = ajv.validate(require('./json-schema/get-object-schema.json'), responseData)

        if (!valid){
            console.error("AJV Validation Errors: ", ajv.errorsText());
        }

        expect(valid).toBe(true);
    });

    test('Test Case POST Create User', async ({ request}) => {
        const body = {
            "name": "Hansen",
            "job": "QA Tester"
        }
        const header = {
            Accept: 'application/json'
        }

        const response = await request.post(baseUrl + 'api/users', {
            headers:header,
            data:body
        });

        expect(response.status()).toBe(201);

        const responseData = await response.json();

        const valid = ajv.validate(require('./json-schema/post-object-schema.json'), responseData)

        if (!valid){
            console.error("AJV Validation Errors: ", ajv.errorsText());
        }

        expect(valid).toBe(true);

        console.log(response.status());
        console.log(await response.json());
    });

    test('Test Case DELETE User', async ({ request }) => {
        const response = await request.delete(baseUrl + 'api/users/2')

        expect(response.status()).toBe(204);

        console.log(response.status());
    });
    
    test('Test Case PUT User', async ({ request }) => {
        const body = {
            "name": "Hansen",
            "job": "QA Tester"
        }
        const header = {
            Accept: 'application/json'
        }

        const response = await request.put(baseUrl + 'api/users/2', {
            headers:header,
            data:body
        });

        expect(response.status()).toBe(200);

        const responseData = await response.json();

        const valid = ajv.validate(require('./json-schema/put-object-schema.json'), responseData)

        if (!valid){
            console.error("AJV Validation Errors: ", ajv.errorsText());
        }

        expect(valid).toBe(true);

        console.log(response.status());
        console.log(await response.json());
    });
    

});



