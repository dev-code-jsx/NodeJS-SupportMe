'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js';
import userRoutes from '../src/user/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import { newUser } from '../src/user/user.controller.js';
/*import userRoutes from '../src/users/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import companyRoutes from '../src/companies/company.routes.js';*/


class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuarioPath = '/supportMe/v1/user'
        this.authPath = '/supportMe/v1/auth'





        /*this.usuarioPath = '/companyControl/v1/users'
        this.authPath = '/companyControl/v1/auth'
        this.companyPath = '/companyControl/v1/company'*/

        this.middlewares();
        this.conectarDB();
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
        await newUser();
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
        /*this.app.use(this.authPath, authRoutes);
        this.app.use(this.usuarioPath, userRoutes);
        this.app.use(this.companyPath, companyRoutes);*/
        this.app.use(this.usuarioPath, userRoutes);
        this.app.use(this.authPath, authRoutes);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;