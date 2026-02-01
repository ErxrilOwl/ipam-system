# Web-Based IP Address Management System

## About
> This repository contains the solution for the Sr. Fullstack Developer Practical Test for Techlint. It contains several services built with Laravel, NodeJS and React; with a microservice architecture.

## Installation

### Building & Running Containers

#### Dev Build
Once the Docker Engine/Desktop is running on the host machine, open a terminal in the projects root directory and enter the following commands:
- `docker-compose -f docker-compose.dev.yml up --build` - This builds the required Docker containers. Will take a while initially but subsequent builds won't take long. Then will start all the development Docker containers
- Copy the file `.env.docker` to `.env` in every services
- `docker-compose exec auth-service composer install` - To install dependencies
- `docker-compose exec auth-service php artisan key:generate` - To generate key for Laravel
- `docker-compose exec auth-service php artisan migrate --seed` - This will populate the database with initial data
- `docker-compose exec auth-service php artisan jwt:secret` - This will generate JWT secret that needs to be copy and pasted in all .env with JWT_SECRET (auth-service, gateway-service, ip-service)
- `docker-compose exec ip-service composer install` - To install dependencies
- `docker-compose exec ip-service php artisan key:generate` - To generate key for Laravel
- `docker-compose exec ip-service php artisan migrate` - This will populate the database with initial data

> **Note:** use `docker-compose -f docker-compose.dev.yml up` for development

#### Staging and Production Build
Once the Docker Engine/Desktop is running on the host machine, open a terminal in the projects root directory and enter the following commands:
- `docker-compose up --build` - This builds the required Docker containers. Will take a while initially but subsequent builds won't take long. Then will start all the development Docker containers
- Copy the file `.env.docker` to `.env` in every services
- `docker-compose exec auth-service php artisan key:generate` - To generate key for Laravel
- `docker-compose exec auth-service php artisan migrate --seed` - This will populate the database with initial data
- `docker-compose exec auth-service php artisan jwt:secret` - This will generate JWT secret that needs to be copy and pasted in all .env with JWT_SECRET (auth-service, gateway-service, ip-service)
- `docker-compose exec ip-service php artisan key:generate` - To generate key for Laravel
- `docker-compose exec ip-service php artisan migrate` - This will populate the database with initial data
