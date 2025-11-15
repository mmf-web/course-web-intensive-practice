curl http://localhost:3000/transactions
# [{"amount":12.23,"id":1763192625110}]%        

curl \                                 
  --request POST \
  --data '{"amount": 12.23}' \
  --header 'Content-Type: application/json' \
  http://localhost:3000/transactions
# Created%                                      

curl http://localhost:3000/transactions
# [{"id":1763192917933,"amount":12.23}]%        

# curl \                                 
  --request PATCH \
  --data '{"amount": 13.23}' \
  --header 'Content-Type: application/json' \
  http://localhost:3000/transactions/1763192917933
# OK%                                           

curl http://localhost:3000/transactions
# [{"id":1763192917933,"amount":13.23}]%        
