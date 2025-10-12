import { model,Schema } from "mongoose";
const userSchema=new Schema({
  username :{type:String,trim: true,required:false},
  email:{type:String,trim:true,required:true},
  password:{type:String,required:true}
},
{timestamps:true,versionKey:false},
);
userSchema.pre("Save",function(next){
  if(!this.username){
    this.username=this.email;
  }
  next();
});


userSchema.methods.toJSON=function(){
  const obj=this.toObject();
  delete obj.password;
  return obj;
};
export const User=model("User",userSchema);

