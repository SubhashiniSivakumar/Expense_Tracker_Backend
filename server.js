const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors')

const app=express();
const PORT=3000;
app.use(cors());
app.use(express.json());

const MONGO_URI='mongodb+srv://subhashinisiva16:subhashinisiva16@expense.uzg8uj7.mongodb.net/expense?retryWrites=true&w=majority&appName=Expense'
const connectDb=async()=>{
    try{
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
    }catch(err){
        console.log('Error Connecting to MongoDB',err);
        process.exit(1);
    }
} 
const expenseSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    }
});
const Expense=mongoose.model('Expense',expenseSchema);
app.post(`/expenses`,async(req,res)=>{
    try{
        const {title,amount}=req.body;
        const expense=new Expense({title,amount});
        await expense.save();
        res.status(201).json(expense);
    }catch(error){
        console.log('Error saving Expense',error);
    }
})
app.get('/expenses',async(req,res)=>{
    try{
        const expenses=await Expense.find();
        res.json(expenses);
    }catch(error){
        console.log('Error fetching expenses:',error);
        res.status(500).json({error:'Internal server error'});
    }
})


app.delete('/expenses/:id',async(req,res)=>{
    try{
        const deleteExpenses=await Expense.findByIdAndDelete(req.params.id)
        if(!deleteExpenses){
            return res.status(404).json({error:"Expenses not found"})
        }
        res.json({message:"Deleted Successfully"})
    }catch(error){
        console.log("Error deleting expenses:",error);
        res.status(500).json({error:"Failed to delete expense"})
    }
})


connectDb().then(()=>{
app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});
})