import React, { useState,useEffect, useContext } from "react";
import './Login-SignUp.css'
import emailIcon from '../Assets/email.png'
import passwordIcon from '../Assets/password.png'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth} from "../../context/auth";
import axios from "axios";
import { toast } from "react-toastify";


function Login(){

    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const [auth,setAuth]=useAuth('');
    const [formValues,setFormValues]=useState({
        email:'',
        password:'',
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate=useNavigate();
    
    const handleReset=async(e) => {
        e.preventDefault();

        if(!email)
        {
            toast.warning("Enter your email");
        }
        const res=await axios.post(`${import.meta.env.VITE_API}/api/v1/reset-password-token`,{email});

        console.log(res.data.success);


    }
    const handleSubmit = async (e) => {
        console.log(formErrors.email);
        console.log(formErrors.password);
        e.preventDefault();

        setIsSubmit(true);
        setFormErrors(validate(formValues));
    
        try {
            
          const res = await axios.post(
            `${import.meta.env.VITE_API}/api/v1/login`,
            {email,password} 
          );
    
          if (res && res.data.success) {
                toast.success("Logged in successfully");
                
                setAuth({
                    ...auth,
                    user:res.data.user,
                    token:res.data.token,
          
                  });
                  navigate("/HomePage");
                  localStorage.setItem('auth',JSON.stringify(res.data));
          } else {
            
                alert("not logged in")
          }
        } catch (erorr) {
            console.error(erorr)
            toast.warning("Something went wrong");
            
        }
      };

     const handleChange=(e)=>{
        if(e.target.name=='email') setEmail(e.target.value);
        if(e.target.name=='password') setPassword(e.target.value);

       // console.log(email+" "+password);
       // console.log(formValues);
        setFormValues({...formValues,[e.target.name]:e.target.value});
    };

     const validate=(values)=>{

        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if (!values.email) {
        errors.email = "Email is required!";
        } else if (!regex.test(values.email)) {
        errors.email = "This is not a valid email format!";
        }
        if (!values.password) {
        errors.password = "Password is required";
        } else if (values.password.length < 4) {
        errors.password = "Password must be more than 4 characters";
        } else if (values.password.length > 10) {
        errors.password = "Password cannot exceed more than 10 characters";
        }

        return errors;
    }

     useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
        console.log(formValues);
        }
    }, [formErrors]);
      
    return (
       <div>
        {/* <pre>{JSON.stringify(formValues,undefined,2)}</pre> */}
        <div class="title">Log in</div>
        <form class="flip-card__form" action="">
            <input 
                class="flip-card__input" 
                name="email" 
                placeholder="Email" 
                type="email"
                value={formValues.email}
                onChange={handleChange} 
            />
            {formErrors.email!=undefined?<p>{formErrors.email}</p>:null}

            <input
                class="flip-card__input" 
                type="password"
                name="password" 
                placeholder="Password" 
                value={formValues.password}
                onChange={handleChange}
            />
            {formErrors.password!=undefined?<p>{formErrors.password}</p>:null}

            <button class="flip-card__btn" onClick={handleSubmit}>Let`s go!</button>

           
        </form>
    </div>
    )
}

export default Login;