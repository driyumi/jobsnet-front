(function ($) {
  $('.alert-success').hide();

  $('#cep').mask('00000-000');
  $('#telefoneFixo1').mask('(00) 00009-0000');
  $('#telefoneFixo2').mask('(00) 00009-0000');
  $('#celular').mask('(00) 00009-0000');
  $('#cpf').mask('000.000.000-00', {reverse: true});

  // Método para consultar o CEP
  $('#cep').on('blur', function() {
    if($.trim($("#cep").val()) != "" && $('#cep').val().length == 9){
      $.ajax({
        url: "https://viacep.com.br/ws/" + $('#cep').val() + "/json/",
        dataType: 'jsonp',
        contentType: "application/json",
        success : function(response) {
          if (response.logradouro) {
            $("input[name=logradouro]").val(response.logradouro);
            $("input[name=bairro]").val(response.bairro);
            $("input[name=cidade]").val(response.localidade);
            $("input[name=estado]").val(response.uf);
          }
        }
      });
    }
  });


  $('#submitButton').click(function (e) {
    e.preventDefault;

    var validacpf = validaCPF($('#cpf').val());
    if (validacpf === true) {
        var dados = $('form').serializeArray();
        var dataJson = {};
        $(dados).each(function(index, obj){
            dataJson[obj.name] = obj.value;
        });
        console.log(dataJson)
        const usuario = fetch('http://18.223.182.86/cadastrar', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataJson)
        });
        if (usuario.status === 200) {
            alert('DEU CERTO')
        }
        // $.ajax({
        //     type: "POST",
        //     url: "http://18.223.182.86/cadastrar",
        //     data: JSON.stringify(dataJson),
        //     dataType: 'json',
        //     contentType: "application/json",
        //     cache: false,
        //     success: function(data) {
        //         console.log('sucess', data)
        //         $('#submitSuccessMessage').hide();
        //         $('.alert-success').removeClass('.d-none');
        //         $(document).scrollTo('.alert-success');
        //     },
        //     error: function (data) {
        //         console.log('error', data.response)
        //     }
        // });
    } else {
      alert('CPF inválido!');
    }

    return false;
  })
})(jQuery);

function validaCPF(strCPF) {
  var Soma;
  var Resto;
  Soma = 0;
  if (strCPF == "00000000000") return false;
  strCPF = strCPF.replace(/[\-./]/gi,'');

  for (var i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11))  Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

  Soma = 0;
  for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11))  Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
  return true;
}
