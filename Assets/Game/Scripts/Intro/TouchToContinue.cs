using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Playables;

public class TouchToContinue : MonoBehaviour
{

    public PlayableDirector playableDirector;

    // Start is called before the first frame update
    void Start()
    {


        
    }

    // Update is called once per frame
    void Update()
    {

        print(Input.GetKeyDown(KeyCode.A));

        if (Input.GetKey(KeyCode.A)) {
            playableDirector.time = 6;

            print("FOI");
        }
            

        if (Input.GetKeyUp (KeyCode.Space)) 
            playableDirector.Stop();

        




    }


}
