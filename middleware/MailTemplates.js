

const URL = "https://api.bankajob.com/";



const mailTemplate = (option)=>{
	if(option?.MailBy==="verify"){
		return `<div>
		<table width='600' cellspacing='1' cellpadding='5' align='center' border='0'>
			<tbody>
				<tr style='background:#fff'>
					<td>
						<table>
							<tbody>
								<tr>
									<td style='word-break:break-word' bgcolor='#FFFFFF' valign='top'>
									<font face='Arial, Helvetica, sans-serif' color='#000000'>                 
				 
					
					   <p style='clear:both;font-size:12px;padding:0 0 10px 0'><strong>Dear ${option.name},</strong></p>   
					 
				  <div style='margin:0px;padding:10px 0px;font-size:12px;font-family:Arial,Helvetica,sans-serif;word-break:break-word'>
					<div style='margin-bottom:5px;line-height:17px;margin-left:0;margin-right:0;margin-top:0'>
	We have received a request to verify your email address your account. To ensure your account's security, we require a one-time password verification.<br/><br/>
	
	<div style='font-size:15px; font-weight:600;font-family:Arial,Helvetica,sans-serif;'>Your OTP is : <b style='letter-spacing:3px;'>${option.otp}</b></div><br/>
	
	Please enter this code on the our job portal to complete the verification process.<br/>
	
	This code is valid for 5 minutes.<br/>
	
	If you did not initiate this request, please ignore this email and your account will remain secure.<br/><br/>
	
	Thank you for your cooperation.
	
					</div>
				  </div>  <br>  
				  <div style='margin:0px;padding:10px 0px;font-size:12px;line-height:18px; font-weight:normal;font-family:Arial,Helvetica,sans-serif;word-break:break-word'>
					<strong>Best Regards,</strong><br/>
					  Team bankAjob.com
				  </div>  
				  <div style='clear:both'></div>        
				  </font></td>
								</tr>
							
								<tr>
									<td valign='top' bgcolor='#FFFFFF'><font face='Arial, Helvetica, sans-serif' color='#313131'>
				  <div style='border-top:1px solid #888888;border-bottom:1px solid #888888;line-height:16px;font-size:10px;font-weight:bold'>
					Disclaimer:
				  </div>
				  <div style='padding-top:5px;font-size:10px;line-height:12px;font-family:Arial,Helvetica,sans-serif;word-break:break-word'>
					Do Not forward this email.   </div> </font>
								
									
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
				
			</tbody>
		</table>
			</div>
		`
	}
	if(option?.MailBy==="createdCandidate"){
		return `<div>
		<table width='600' cellspacing='1' cellpadding='5' align='center' border='0'>
			<tbody>
				<tr style='background:#fff'>
					<td>
						<table>
							<tbody>
								<tr>
									<td style='word-break:break-word' bgcolor='#FFFFFF' valign='top'>
									<font face='Arial, Helvetica, sans-serif' color='#000000'>                 
				 
					
					   <p style='clear:both;font-size:12px;padding:0 0 10px 0'><strong>Dear ${option.name},</strong></p>   
					 
				  <div style='margin:0px;padding:10px 0px;font-size:12px;font-family:Arial,Helvetica,sans-serif;word-break:break-word'>
					<div style='margin-bottom:5px;line-height:17px;margin-left:0;margin-right:0;margin-top:0'>
					Welcome to bankAjob.com, the platform that helps you find the right jobs.
<br/>
We invite you to experience all the benefits of the platform today. It's absolutely free and easy!
<br/>
<br/>
<br/>
<a title="Your bankAjob profile to the Candidate in one click" href="${process.env.FRONTEND}jobs" style="margin-right:5px;background:#265df5;font-size:14px;font-weight:bold;color:#fff; border-radius:5px; padding:6px 14px 7px;font-family:Arial,Helvetica,sans-serif;text-decoration:none" rel="noreferrer" target="_blank">Find A Job</a>
</div>
				  </div>  <br>  
				  <div style='margin:0px;padding:10px 0px;font-size:12px;line-height:18px; font-weight:normal;font-family:Arial,Helvetica,sans-serif;word-break:break-word'>
					<strong>Best Regards,</strong><br/>
					  Team bankAjob.com
					
				  </div>  
				  <div style='clear:both'></div>        
				  </font></td>
								</tr>
							
								<tr>
									<td valign='top' bgcolor='#FFFFFF'><font face='Arial, Helvetica, sans-serif' color='#313131'>
				  <div style='border-top:1px solid #888888;border-bottom:1px solid #888888;line-height:16px;font-size:10px;font-weight:bold'>
					Disclaimer:
				  </div>
				  <div style='padding-top:5px;font-size:10px;line-height:12px;font-family:Arial,Helvetica,sans-serif;word-break:break-word'>
				  <strong>No.1 Bank Job sites in India :</strong> bankAjob.com is one of the best job portals for Bank Jobs, offers opportunities to trained and experienced professionals, useful if you are a fresher who is searching for a job. Helps Job Seekers to connect with the right people and let Freshers get a job on demand lines in the industry as per your choice.
				<br/>	
				<br/>	
				  Do Not forward this email.   </div> </font>
								
									
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
				
			</tbody>
		</table>
			</div>
		`
	}
	if(option?.MailBy==="createdRecruiter"){
		return `<div>
		<table width='600' cellspacing='1' cellpadding='5' align='center' border='0'>
			<tbody>
				<tr style='background:#fff'>
					<td>
						<table>
							<tbody>
								<tr>
									<td style='word-break:break-word' bgcolor='#FFFFFF' valign='top'>
									<font face='Arial, Helvetica, sans-serif' color='#000000'>                 
				 
					
					   <p style='clear:both;font-size:12px;padding:0 0 10px 0'><strong>Dear ${option.name},</strong></p>   
					 
				  <div style='margin:0px;padding:10px 0px;font-size:12px;font-family:Arial,Helvetica,sans-serif;word-break:break-word'>
					<div style='margin-bottom:5px;line-height:17px;margin-left:0;margin-right:0;margin-top:0'>
					Welcome to bankAjob.com, the platform that helps you hire the right talent for your company.
<br/>
<br/>
We invite you to experience all the benefits of the platform today. It's absolutely free and easy!
<br/>
<br/>
<br/>
<a title="Your bankAjob profile to the Recruiter in one click" href="${process.env.FRONTEND}recruiter/post-job" style="margin-right:5px;background:#265df5;font-size:14px;font-weight:bold;color:#fff; border-radius:5px; padding:6px 14px 7px;font-family:Arial,Helvetica,sans-serif;text-decoration:none" rel="noreferrer" target="_blank">Post A Job</a>
</div>
				  </div>  <br>  
				  <div style='margin:0px;padding:10px 0px;font-size:12px;line-height:18px; font-weight:normal;font-family:Arial,Helvetica,sans-serif;word-break:break-word'>
					<strong>Best Regards,</strong><br/>
					  Team bankAjob.com
					
				  </div>  
				  <div style='clear:both'></div>        
				  </font></td>
								</tr>
							
								<tr>
									<td valign='top' bgcolor='#FFFFFF'><font face='Arial, Helvetica, sans-serif' color='#313131'>
				  <div style='border-top:1px solid #888888;border-bottom:1px solid #888888;line-height:16px;font-size:10px;font-weight:bold'>
					Disclaimer:
				  </div>
				  <div style='padding-top:5px;font-size:10px;line-height:12px;font-family:Arial,Helvetica,sans-serif;word-break:break-word'>
				  <strong>No.1 Bank Job sites in India :</strong> bankAjob.com is one of the best job portals for Bank Jobs, offers opportunities to trained and experienced professionals, useful if you are a fresher who is searching for a job. Helps Job Seekers to connect with the right people and let Freshers get a job on demand lines in the industry as per your choice.
				<br/>	
				<br/>	
				  Do Not forward this email.</div></font>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
				
			</tbody>
		</table>
			</div>
		`
	}
	if(option.MailBy==="job"){
		const str = option?.job?.location.map(obj => obj.name).join(', ');
		const skill = option?.job?.tags.map(obj => obj.name).join(', ');
		const experience = option?.job?.experienceType?._id==="66c1bce36f63f5c03cae4790"?"Fresher":`${option?.job?.experienceMinYear} - ${option?.job?.experienceMaxYear} Yrs`
		const salary =option?.job?.salaryNotDisclosed?"Not Disclosed":`${option?.job?.startMinsalary||"0"}.${option?.job?.endMinsalary||"0"} - ${option?.job?.startMaxsalary||"0"}.${option?.job?.startMinsalary||"0"} Lac P.A.`;
		const address = option?.job?.recruiter?.address?option?.job?.recruiter?.address:option?.job?.recruiter?.location?.name
		return `<div>
	<table width="600" cellspacing="1" cellpadding="5" align="center" border="0">
		<tbody>
			<tr>
				<td style="word-break:normal;margin-bottom:5px;line-height:16px" height="30" bgcolor="#ffffff" align="center"> 
				<span style="font-size:11px;font-family:Arial,Helvetica,sans-serif;color:#888">The sender of this email is registered with bankAjob.com as ${option?.job?.recruiter?.companyName||""} company. 
        <div style="font-size:11px;font-family:Arial,Helvetica,sans-serif;color:#333">
         Do Not forward this email, it contains links which allow direct login to your bankAjob account.
        </div> </span></td>
			</tr>
			<tr>
				<td bgcolor="#fafafa" style="border:1px solid #eeeeee;padding:5px;">
					<table width="100%">
						<tbody>
							<tr>
								<td width="10%" style="font-family:Arial;font-size:12px;color:#666;padding:3px 8px 3px 4px;background:#ffffff;border:1px solid #dddddd;" valign="top">
								<img 
								src=${option?.job?.team?.image?URL+option?.job?.team?.image:URL+'/user.png'}
								width="80" height="80" data-bit="iit"></td>
								<td width="80%" style="font-family:Arial;font-size:12px;color:#333; padding-left:10px;" valign="top">
									<div style="font-size:16px; font-weight:700; text-transform:captilize; margin-bottom:5px;">${option?.job?.team?.name}</div>
										<div style="margin-bottom:2px;">
										<span> ${option?.job?.team?.designation||""}</span><br>
										<span> ${option?.job?.recruiter?.companyName||""} - ${option?.job?.recruiter?.location?.name||""}</span></div>
										<a href="${process.env.FRONTEND}company-info/${option?.job?.recruiter?._id}" style="color:#008ed7;text-decoration:none;margin-top:4px;float:left" rel="noreferrer" target="_blank"><strong style="color:#265df5">Follow my job updates</strong></a></td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
			<tr style="background:#fff">
				<td>
					<table>
						<tbody>
							<tr>
								<td style="word-break:break-word" bgcolor="#FFFFFF" valign="top">
								<font face="Arial, Helvetica, sans-serif" color="#000000">                 
                <span style="font-size:13px !important">
             <div style="margin:0px;padding:3px 0px;font-size:17px">
              <strong>${option?.job?.name}</strong>
             </div>
 <div style="margin:0px;padding:3px 0px">
              <strong>Industry:</strong> ${option?.job?.industry?.name}
             </div> 			 
             <div style="margin:0px;padding:3px 0px">
              <strong>Experience required for the Job:</strong> ${experience}
             </div>   
             <div style="margin:0px;padding:3px 0px">
              <strong>Package of the Job:</strong> ${salary}
             </div> 
             <div style="word-break:break-word">
              
             </div> 
             <div style="margin:0px;padding:3px 0px;word-break:break-word">
              <strong>Job Location:</strong> ${str}
             </div>  
             <div style="margin:0px;padding:3px 0px">
              <strong>Key Skills :</strong> ${skill}
             </div> </span>
                   <br>  <br>
				   <a title="Send your bankAjob profile to the recruiter in one click" href="${process?.env?.FRONTEND}job/${option?.job?.slug}?rdct=email" style="margin-right:5px;background:#265df5;font-size:15px;font-weight:bold;color:#fff; border-radius:5px; padding:6px 16px 7px;font-family:Arial,Helvetica,sans-serif;text-decoration:none" rel="noreferrer" target="_blank">Apply Now</a>    
				   <br> <br>
				   <p style="clear:both;font-size:12px;padding:0 0 10px 0; text-transform:captilize;"><strong>Dear ${option?.name},</strong></p>   
				 
              <blockquote style="margin:0px;padding:10px 0px;font-size:12px;font-family:Arial,Helvetica,sans-serif;word-break:break-word">
                <div style="margin-bottom:5px;line-height:16px;margin-left:0;margin-right:0;margin-top:0">
				${option?.job?.mailText}
				</div>
              </blockquote><br>  
              <p style="margin:0px;padding:10px 0px;font-size:12px;line-height:16px; font-weight:normal;font-family:Arial,Helvetica,sans-serif;word-break:break-word">
                <strong>${option?.job?.team?.name||""}</strong><br/>
                ${option?.job?.team?.designation||""} at ${option?.job?.recruiter?.companyName||""}<br/>
				${option?.job?.team?.contact||""}
				
              </p>  
              <div style="clear:both"></div>        
              </font></td>
							</tr>
						
							<tr>
								<td valign="top" bgcolor="#FFFFFF"><font face="Arial, Helvetica, sans-serif" color="#313131">
              <div style="border-top:1px solid #888888;border-bottom:1px solid #888888;line-height:16px;font-size:10px;font-weight:bold">
                Disclaimer:
              </div>
              <div style="padding-top:5px;font-size:10px;line-height:12px;font-family:Arial,Helvetica,sans-serif;word-break:break-word">
                The sender of this email is registered with <a href="https://bankajob.com" rel="noreferrer" target="_blank">bankAjob.com</a> as <strong>${option?.job?.recruiter?.companyName||""}. </strong> (${address}) using bankAjob.com services. The responsibility of checking the authenticity of offers/correspondence lies with you. If you consider the content of this email inappropriate or spam, you may: Forward this email to: <a href="mailto:compliance@bankajob.com" rel="noreferrer" target="_blank">compliance@bankajob.com</a>.
                <br><strong>Please Note:</strong> This mail is a private message from the recruiter. We have enabled auto login for your convenience, you are strongly advised not to forward this email to protect your account from unauthorized access.
                <br><strong>Advisory</strong>: Please do not pay any money to anyone who promises to find you a job. This could be in the form of a registration fee or document processing fee or visa charges or any other pretext. The money could be asked for upfront or it could be asked after trust has been built after some correspondence has been exchanged. Also please note that in case you get a job offer or a letter of intent without having been through an interview process it is probably a scam and you should contact <a href="mailto:compliance@bankajob.com" rel="noreferrer" target="_blank">compliance@bankajob.com</a> for advise.
              </div> </font>
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
				<tbody>
					<tr>
						<td height="5"></td>
					</tr>
					<tr>
						<td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;border:1px solid #ff8367;padding:5px 10px;line-height:16px;background:#fff8c7" align="center"><a href="${process.env.FRONTEND}candidate/account-setting" style="font-weight:bold;line-height:16px;font-family:Arial,Helvetica,sans-serif;font-size:12px" title="Update Your Resume Now" rel="noreferrer" target="_blank">Update Your Resume Now</a> to be on the top of Employer"s Resume Search </td>
					</tr>
					<tr>
						<td height="5"></td>
					</tr>
				</tbody>
			</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
			
		</tbody>
	</table>
	</div>`
	}
	if(option.MailBy==="applyCandidate"){
		const str = option?.job?.location.map(obj => obj.name).join(', ');
		const skill = option?.job?.tags.map(obj => obj.name).join(', ');
		const experience = option?.job?.experienceType?._id==="66c1bce36f63f5c03cae4790"?"Fresher":`${option?.job?.experienceMinYear} - ${option?.job?.experienceMaxYear} Yrs`
		const salary =option?.job?.salaryNotDisclosed?"Not Disclosed":`${option?.job?.startMinsalary||""}.${option?.job?.endMinsalary||""} - ${option?.job?.startMaxsalary||""}.${option?.job?.startMinsalary||""} Lac P.A.`;
		const address = option?.job?.recruiter?.address?option?.job?.recruiter?.address:option?.job?.recruiter?.location?.name
		
		return `<div>
	<table width="600" cellspacing="1" cellpadding="5" align="center" border="0">
		<tbody>
			<tr>
				<td style="word-break:normal;margin-bottom:5px;line-height:16px" height="30" bgcolor="#ffffff" align="center"> 
				<span style="font-size:11px;font-family:Arial,Helvetica,sans-serif;color:#888">The sender of this email is registered with bankAjob.com as ${option?.job?.recruiter?.companyName||""} company. 
        <div style="font-size:11px;font-family:Arial,Helvetica,sans-serif;color:#333">
         Do Not forward this email, it contains links which allow direct login to your bankAjob account.
        </div> </span></td>
			</tr>
			<tr style="background:#fff">
				<td>
					<table>
						<tbody>
							<tr>
								<td style="word-break:break-word" bgcolor="#FFFFFF" valign="top">
								<font face="Arial, Helvetica, sans-serif" color="#000000">                 
                <span style="font-size:13px !important">
             <div style="margin:0px;padding:3px 0px;font-size:17px">
              <strong>${option?.job?.name}</strong>
             </div>
 <div style="margin:0px;padding:3px 0px">
              <strong>Industry:</strong> ${option?.job?.industry?.name}
             </div> 			 
             <div style="margin:0px;padding:3px 0px">
              <strong>Experience required for the Job:</strong> ${experience}
             </div>   
             <div style="margin:0px;padding:3px 0px">
              <strong>Package of the Job:</strong> ${salary}
             </div> 
             <div style="word-break:break-word">
              
             </div> 
             <div style="margin:0px;padding:3px 0px;word-break:break-word">
              <strong>Job Location:</strong> ${str}
             </div>  
             <div style="margin:0px;padding:3px 0px">
              <strong>Key Skills :</strong> ${skill}
             </div> </span>
                   <br>
				   <p style="clear:both;font-size:12px;padding:0 0 10px 0; text-transform:captilize;"><strong>Dear<br/>
				   ${option?.job?.team?.name},</strong><br/><br/>
				    This candidate apply for this job.  
				   </p>

				<br>
				
				</td>  
				</tr>

				<tr>
				<td bgcolor="#fafafa" style="border:1px solid #eeeeee;padding:5px;">
					<table width="100%">
						<tbody>
							<tr>
								<td width="10%" style="font-family:Arial;font-size:12px;color:#666;padding:3px 8px 3px 4px;background:#ffffff;border:1px solid #dddddd;" valign="top">
								<img 
								src=${option?.apply.profile?URL+option?.apply.profile:URL+'/user.png'}
								width="80" height="80" data-bit="iit"></td>
								<td width="80%" style="font-family:Arial;font-size:12px;color:#333; padding-left:10px;" valign="top">
									<div style="font-size:16px; font-weight:700; text-transform:captilize; margin-bottom:5px;">${option?.apply?.name}</div>
										<div style="margin-bottom:2px;">
										<span> ${option?.apply?.prefdepartment?.name||""}</span><br>
										<small style="color:#e53124;font-size:12px">${option?.apply?.location?.name||""}</small></span>
										<br><a href="${process.env.FRONTEND}recruiter/candidate-details/${option?.apply?._id}" style="color:#008ed7;text-decoration:none;margin-top:4px;float:left" rel="noreferrer" target="_blank"><strong style="color:#265df5">View Profile</strong></a></td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
			<tr>
			<td style="border:1px solid #eeeeee;padding:5px;">
              <p style="margin:0px;padding:10px 0px;font-size:12px;line-height:16px; font-weight:normal;font-family:Arial,Helvetica,sans-serif;word-break:break-word">
                <strong>${option?.job?.team?.name||""}</strong><br/>
                ${option?.job?.team?.designation||""} at ${option?.job?.recruiter?.companyName||""}<br/>
				${option?.job?.team?.contact||""}
				
              </p>  
              <div style="clear:both"></div>        
              </font></td>
							</tr>
						
							<tr>
								<td valign="top" bgcolor="#FFFFFF"><font face="Arial, Helvetica, sans-serif" color="#313131">
              <div style="border-top:1px solid #888888;border-bottom:1px solid #888888;line-height:16px;font-size:10px;font-weight:bold">
                Disclaimer:
              </div>
              <div style="padding-top:5px;font-size:10px;line-height:12px;font-family:Arial,Helvetica,sans-serif;word-break:break-word">
                The sender of this email is registered with <a href="https://bankajob.com" rel="noreferrer" target="_blank">bankAjob.com</a> as <strong>${option?.job?.recruiter?.companyName||""}. </strong> (${address}) using bankAjob.com services. The responsibility of checking the authenticity of offers/correspondence lies with you. If you consider the content of this email inappropriate or spam, you may: Forward this email to: <a href="mailto:compliance@bankajob.com" rel="noreferrer" target="_blank">compliance@bankajob.com</a>.
                <br><strong>Please Note:</strong> This mail is a private message from the recruiter. We have enabled auto login for your convenience, you are strongly advised not to forward this email to protect your account from unauthorized access.
                <br><strong>Advisory</strong>: Please do not pay any money to anyone who promises to find you a job. This could be in the form of a registration fee or document processing fee or visa charges or any other pretext. The money could be asked for upfront or it could be asked after trust has been built after some correspondence has been exchanged. Also please note that in case you get a job offer or a letter of intent without having been through an interview process it is probably a scam and you should contact <a href="mailto:compliance@bankajob.com" rel="noreferrer" target="_blank">compliance@bankajob.com</a> for advise.
              </div> </font>
									<table width="100%" border="0" cellspacing="0" cellpadding="0">
										<tbody>
											<tr>
												<td height="5"></td>
											</tr>
											<tr>
												<td height="5"></td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
	</div>`
	}
}
module.exports = mailTemplate;