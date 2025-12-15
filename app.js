    const express =require('express');
    const app= express();
    app.use(express.json());
    var cors=require('cors');
    app.use(cors());
    const cardRoutes= require('./routes/flashcard_route');
    const userRoutes =require('./routes/user_route')
    const historyRoutes=require('./routes/history_routes')
    app.use('/card',cardRoutes);
    app.use('/user',userRoutes);
    app.use('/history',historyRoutes)
    module.exports=app;