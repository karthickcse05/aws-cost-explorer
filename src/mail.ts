import { SES, AWSError } from 'aws-sdk';
import { SendEmailRequest, SendEmailResponse, SendRawEmailRequest } from 'aws-sdk/clients/ses';
import { TotalCosts } from '../src/cost';

export async function sendMail(alias: string,totals:TotalCosts,sender:string,toaddress:string): Promise<string> {
    const totalCosts = totals.totals;
    const serviceCosts = totals.totalsByService;
    const allServices = Object.keys(serviceCosts.yesterday);
    const sortedServiceNames = allServices.sort((a, b) => b.length - a.length);

    const maxServiceLength =
        sortedServiceNames.reduce((max, service) => {
        return Math.max(max, service.length);
        }, 0) + 1;
    
    const totalLastMonth = `$${totalCosts.lastMonth.toFixed(2)}`;
    const totalThisMonth = `$${totalCosts.thisMonth.toFixed(2)}`;
    const totalLast7Days = `$${totalCosts.last7Days.toFixed(2)}`;
    const totalYesterday = `$${totalCosts.yesterday.toFixed(2)}`;
    const headerPadLength = 11;
    
    let data = "";
    for (let service of sortedServiceNames) {
        const serviceLabel = (service.padStart(maxServiceLength));
        const lastMonthTotal = (`$${serviceCosts.lastMonth[service].toFixed(2)}`.padEnd(headerPadLength));
        const thisMonthTotal = (`$${serviceCosts.thisMonth[service].toFixed(2)}`.padEnd(headerPadLength));
        const last7DaysTotal = (`$${serviceCosts.last7Days[service].toFixed(2)}`.padEnd(headerPadLength));
        const yesterdayTotal =(
          `$${serviceCosts.yesterday[service].toFixed(2)}`.padEnd(headerPadLength)
        );
        data = data +'<tr><td>'+`${serviceLabel}`+'</td>'+'<td>'+`${lastMonthTotal}`+'</td>'+'<td>'+`${thisMonthTotal}`+'</td>'+'<td>'+`${last7DaysTotal}`+'</td>'+'<td>'+`${yesterdayTotal}`+'</td></tr>'
        //console.log(`${serviceLabel} ${lastMonthTotal} ${thisMonthTotal} ${last7DaysTotal} ${yesterdayTotal}`);
        //console.log("data " + data);
      }

    const table = ``

    const BODY_HTML = `<html>
        <head>
        <style>
            table {
                font-family: arial, sans-serif;
                border-collapse: collapse;
            }

            td, th {
                border: 1px solid #dddddd;
                padding: 8px;
            }

            tr:nth-child(even) {
                background-color: #dddddd;
            }
        </style>   
        </head> 
        <body>
        <h1 style="text-align:center"><u> ${'AWS Cost Report:'.padStart(maxServiceLength + 1)} ${(alias)} </u> </h1>
        <h4 style="margin:0px;text-align:center"> ${'Last Month'.padStart(maxServiceLength)}: ${(totalLastMonth)}  </h4>
        <h4 style="margin:0px;text-align:center"> ${'This Month'.padStart(maxServiceLength)}: ${(totalThisMonth)}  </h4>
        <h4 style="margin:0px;text-align:center"> ${'Last 7 days'.padStart(maxServiceLength)}: ${(totalLast7Days)}  </h4>
        <h4 style="margin:0px;text-align:center"> ${'Yesterday'.padStart(maxServiceLength)}: ${(totalYesterday)}    </h4>
        <br>
        <br>
        <table>
        <tr>
            <th>${'Service'.padStart(maxServiceLength)}</th>
            <th>${'Last Month'.padStart(headerPadLength)}</th>
            <th>${'This Month'.padStart(headerPadLength)}</th>
            <th>${'Last 7 Days'.padStart(headerPadLength)}</th>
            <th>${'Yesterday'.padStart(headerPadLength)}</th>
        </tr>
        
        ${data}
        </body>
       
        </html>`
    const ses = new SES();

    const params: SendEmailRequest = {
        Destination: {
            ToAddresses: [
                toaddress,
            ]
        },
        Message: {
            Subject: {
                Charset: "UTF-8",
                Data: "AWS Cost Report: " + alias ,
            },
            Body: {
                Html: {
                    Charset: "UTF-8", 
                    Data: BODY_HTML
                   }, 
                //    Text: {
                //     Charset: "UTF-8", 
                //     Data: JSON.stringify(totals.totals)
                //    }
            },
        },
        Source: sender,
    }

    var result = await ses.sendEmail(params).promise();
    console.log("result " + JSON.stringify(result))
    return "success"
}