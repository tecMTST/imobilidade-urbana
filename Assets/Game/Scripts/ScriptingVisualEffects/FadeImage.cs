using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.UI;

public class FadeImage : MonoBehaviour{

    public static FadeImage Instance;

    public bool fadeCoroutineHappening = false;

    public  Image image;


    // Start is called before the first frame update
    void Start()
    {
        Instance = this;

    }

    // Update is called once per frame
    void Update()
    {

        


    }
    
    public IEnumerator Fade(Image img, float alphaInitial, float alphaFinal, float time, bool keepActive = false) {


        fadeCoroutineHappening = true;

        img?.gameObject?.SetActive(true);
        img?.CrossFadeAlpha(alphaInitial, 0, false);
        img?.CrossFadeAlpha(alphaFinal, time, false);

        yield return new WaitForSeconds(time);

        img?.gameObject?.SetActive(keepActive);

        fadeCoroutineHappening = false;

        StopCoroutine("Fade");


        
    }

}
