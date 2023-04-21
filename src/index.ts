import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { getAccountAlias } from './account';
import { calculateServiceTotals, getRawCostByService } from './cost';
import { sendMail } from './mail';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);
  console.log("env var Sender " + process.env.Sender)
  console.log("env var Receiver " + process.env.Receiver)
  
  const alias = await getAccountAlias();
  const rawCosts = await getRawCostByService();
  const totals = calculateServiceTotals(rawCosts);
  

  const mailresult = await sendMail(alias,totals,process.env.Sender??"",process.env.Receiver??"")
  

  return {
      statusCode: 200,
      body: JSON.stringify({
          message: 'Success from aws cost explorer',
      }),
   };
};


