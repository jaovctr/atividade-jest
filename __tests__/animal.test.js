const request = require("supertest");
const app = require('../src/app');
const dados = require('../src/data/animals.json'); 
const fs = require('fs');
const { nanoid } = require('nanoid');

describe('insere bicho', () => {

    afterAll(()  =>{
        while(dados.length>0){
            dados.pop();
        }
        fs.writeFileSync('src/data/animals.json',JSON.stringify(dados));
    });
    it('cadastra um cachorro', async ()=>{
        const res = await request(app).post('/animais?nome=Spike&especie=Cachorro&idade=3');
        expect(res.status).toBe(201);
    });
    it('cadastra gato invalido', async ()=>{
        const res = await request(app).post('/animais?nome=Mimi&especie=Gato&idade=jovem');
        expect(res.status).toBe(400);
    });
    it('nome muito pequeno', async ()=>{
        const res = await request(app).post('/animais?nome=J&especie=Hamster&idade=1');
        expect(res.status).toBe(400);
    })
});

describe('retorna bichos', () =>{
    beforeEach(() =>{
        dados.push({
            'id': nanoid(),
            'nome': 'Spike',
            'especie': 'Cachorro',
            'idade': 3,
        });
        dados.push({
            'id': nanoid(),
            'nome': 'Mimi',
            'especie': 'Gato',
            'idade': 4,
        });
        dados.push({
            'id': nanoid(),
            'nome': 'Jose',
            'especie': 'Hamster',
            'idade': 1,
        });
        fs.writeFileSync('src/data/animals.json',JSON.stringify(dados));
    });

    afterAll(()  =>{
        while(dados.length>0){
            dados.pop();
        }
        fs.writeFileSync('src/data/animals.json',JSON.stringify(dados));
    });
    it('retorna os bichos', async() =>{
        const res = await request(app).get('/animais');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(3);
    });
});

  