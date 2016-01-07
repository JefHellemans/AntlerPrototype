var Company = require('../../app/models/company');

exports.postCompany = function(req,res){
    var company = new Company();


        if(req.body.name===undefined){
            res.send("Name not defined");
        }

        else
        {

            company.Name = req.body.name;
            company.Ticker = req.body.ticker;
            company.Image = req.body.image;
            company.CurrentStockPrice = req.body.currentstockprice;

            company.save(function(err){
                if(err)
                    res.send(err);

                res.json({message:'company added', data:company});

            });
        }


};

exports.getCompanies = function(req,res){
    Company.find(function(err,companies){
        res.json(companies);
    });
};