import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './styles.css';
import {Link, useHistory} from 'react-router-dom';
import {FiArrowLeft, FiPrinter} from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import api from  '../../services/api';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import Dropzone from '../../components/Dropzone';

import logo from '../../assets/logo.svg';

//array ou objeto: manualmente informar o tipo da variavel

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}


const CreatePoint = () => {

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState<string>('0');
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        whatsapp:'',
    });

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {

            const {latitude, longitude} = position.coords;

            setInitialPosition([latitude, longitude])
        })
    }, []);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {

            const ufInitials = response.data.map(uf => uf.sigla);  
            setUfs(ufInitials);      
        })
    }, []);

    useEffect(() => {
        api.get('items').then(response => {
            //console.log(response);
            setItems(response.data);
        });
    }, []);

    useEffect(() => {
        if (selectedUf=== '0'){
            return;
        }
        
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const CityNames = response.data.map(city => city.nome);  
            setCities(CityNames);  

        })
    }, [selectedUf]);

    function handleSelectedUF(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;

        setSelectedUf(uf);
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;

        setSelectedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent){

        setSelectedPosition([event.latlng.lat,event.latlng.lng])
        //console.log(event.latlng);

    }

    function handleInputChange(event:ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target;

        setFormData({ ...formData, [name]:value});
    }

    function handleSelectedItem(id:number){

        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([...selectedItems, id]);
        };

       
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();
       console.log(selectedFile);


        const { name, email, whatsapp } = formData;
        const [latitude, longitude] = selectedPosition;
        const uf = selectedUf;
        const city = selectedCity;
        const items = selectedItems;

        const data = new FormData();

        data.append('name',name);
        data.append('email',email);
        data.append('whatsapp',whatsapp);
        data.append('uf',uf);
        data.append('city',city);
        data.append('latitude',String(latitude));
        data.append('longitude',String(longitude));
        data.append('items',items.join(','));

        if (selectedFile) {
            data.append('image', selectedFile);
        }
        //console.log(data);

        await api.post('/points', data);

        alert('Ponto Criado!');

        history.push('/');
    }

    return (
        <div id="page-create-point">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta"/>

                    <Link to='/'>
                    <FiArrowLeft />
                    Voltar ao início
                    </Link>

                </header>

                <form onSubmit={handleSubmit}>

                    <h1>Cadastro do <br /> ponto de coleta.</h1>

                    <Dropzone onFileUploaded={setSelectedFile}/>

                        <fieldset>
                            <legend>
                                <h2>Dados</h2>
                            </legend>
                            <div className="field">
                                <label htmlFor="name">Nome da entidade</label>
                                <input
                                type="text"
                                name="name"
                                id="name"
                                onChange={handleInputChange}
                                />
                            </div>
                            <div className="field-group">
                                <div className="field">
                                    <label htmlFor="email">E-mail</label>
                                    <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={handleInputChange}
                                    />
                                </div>

                              <div className="field">
                                    <label htmlFor="whatsapp">Whatsapp</label>
                                    <input
                                    type="text"
                                    name="whatsapp"
                                    id="whatsapp"
                                    onChange={handleInputChange}
                                    />
                                </div>`

                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>
                                <h2>Endereço</h2>
                                <span>Selecione o endereço no mapa</span>
                            </legend>

                            <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                                <TileLayer
                                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={selectedPosition}/>
                            </Map>

                            <div className="field-group">
                                <div className="field">
                                    <label htmlFor="uf">Estado (UF)</label>
                                    <select 
                                        onChange = {handleSelectedUF} 
                                        value = {selectedUf}
                                        name="uf" 
                                        id="uf"
                                    >
                                        <option value="0">Selecione uma UF</option>
                                        {ufs.map(uf => (
                                            <option key= {uf} value={uf}>{uf}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="field">
                                    <label htmlFor="city">Cidade</label>
                                    <select 
                                        onChange={handleSelectedCity} 
                                        value = {selectedCity}
                                        name="city" 
                                        id="city"
                                    >
                                        <option value="0">Selecione uma cidade</option>
                                        {cities.map(city => (
                                            <option key= {city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                        </fieldset>

                        <fieldset>
                            <legend>
                                <h2>Ítens de coleta</h2>
                                <span>Selecione um ou mais itens abaixo</span>
                            </legend>
                            
                            <ul className="items-grid">
                                {items.map(item => (
                                     <li
                                        key = {item.id} 
                                        onClick={() => handleSelectedItem(item.id)}
                                        className={selectedItems.includes(item.id) ? 'selected': ''}
                                     >
                                     <img src={item.image_url} alt="Teste"/>
                                     <span>{item.title}</span>
                                 </li>    
                                ))}

                            </ul>
                        </fieldset>
                       
                        <button type="submit">
                        Cadastrar ponto de coleta
                        </button>    

                </form>
            </div>
        </div>
    );
};

export default CreatePoint;