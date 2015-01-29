var AWS = require("aws-sdk"),
		Table = require('cli-table');

module.exports = function(grunt) {
	grunt.registerTask('ec2', 'Ec2 controll', function(arg1) {
    grunt.config.requires('aws.accessKeyId');
    grunt.config.requires('aws.secretAccessKey');
    grunt.config.requires('aws.region');
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    AWS.config.update(grunt.config('aws'));
    var ec2 = new AWS.EC2();

    //mark as async
		var done = this.async();

    if (arg1 == 'list') {
			ec2.describeInstances( function(err, data) {
				if (err) {
					grunt.fail.warn(err);
					return done(false);
				} else {
//					console.log(data.Reservations);

					if (data.Reservations.length > 0) {
						data.Reservations.forEach(function (reservation) {

							var table = new Table({
					    	head: ['InstanceId', 'State'],
					    	colWidths: [20, 20]
							});

							grunt.log.writeln("ReservationId", reservation.ReservationId);

							reservation.Instances.forEach(function (instance){
								table.push(
								    [instance.InstanceId, instance.State.Name]
								);

								grunt.log.writeln(table.toString());
								// console.log('\t InstanceId ', instance.InstanceId);
								// console.log('\t State ', instance.State.Name);
								// console.log('---------------------------------------------');
							});

						});
					} else {

						grunt.log.writeln("no instance", data.length);

					}
				}
			});
    } else {
      grunt.log.writeln(this.name + ", no arguments");
    }
  });
};