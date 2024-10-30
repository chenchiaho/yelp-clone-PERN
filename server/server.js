import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import { query } from './db/index.js';


const app = express()

app.use(express.json())
app.use(morgan('dev'))


// Get all restaurants
app.get('/api/v1/restaurants', async (req, res) => {
    
    try {
        const results = await query("SELECT * FROM restaurants")

        console.log(results)
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                restaurants: results.rows,
            },
            
        })
    } catch (error) {
        console.log(error)
    }
    
})

// Get a Restaurant
app.get('/api/v1/restaurants/:id', async (req, res) => {
    try {
        const results = await query("SELECT * FROM restaurants WHERE id = $1", [req.params.id])

        res.status(200).json({
            status: "success",
            data: {
                restaurants: results.rows[0],
            },
        })
    } catch (error) {
        console.log(error)
    }
})

// Create a Restaurant
app.post('/api/v1/restaurants', async (req, res) => {
        
    try {
        const results = await query(
            "INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) returning *", 
            [req.body.name, req.body.location, req.body.price_range]
        )
        
        res.status(201).json({
            status: "success",
            data: {
                restaurant: results.rows[0]
            }
        })
    } catch (error) {
        console.log(error)
    }
})

// Update Restaurants
app.put("/api/v1/restaurants/:id", async (req, res) => {
        try {
            const results = await query(
                "UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 RETURNING *", 
                [req.body.name, req.body.location, req.body.price_range, req.params.id]
            );

            res.status(200).json({
                status: "success",
                data: {
                    restaurant: results.rows[0]
                }
            })
        } catch (err) {
            console.error(err);
            res.status(500).json({
                status: "error",
                message: "An error occurred while updating the restaurant."
            });
        }
})

// Delete Restaurants
app.delete("/api/v1/restaurants/:id", async (req, res) => {
    try {
        const results = query(
            "DELETE FROM restaurants WHERE id = $1",
            [req.params.id]
        )
        res.status(204).json({
            status: "success"
        })
    } catch (error) {
        console.log(error)
    }
})

const port = process.env.PORT || 3001;

app.listen(port, ()=> {
    console.log(`server running on ${port}`)
})